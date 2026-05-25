// src/lib/tile-to-mesh.ts
import * as THREE from "three";
import earcut from "earcut";
import type { VectorTileLayer } from "@mapbox/vector-tile";

export function buildingsLayerToMesh(layer: VectorTileLayer): THREE.Mesh {
	const positions: number[] = []; // [x,y,z, x,y,z, ...]
	const indices: number[] = []; // [a,b,c, a,b,c, ...]  triangle vertex indices

	const extent = layer.extent; // 4096, but read it from the data — never hardcode
	const scale = 1 / extent; // normalize to [0..1]

	let vertexOffset = 0; // we accumulate vertices across all features,
	// so each feature's triangle indices need to be shifted

	for (let i = 0; i < layer.length; i++) {
		const feature = layer.feature(i);
		if (feature.type !== 3) continue; // polygons only

		const rings = feature.loadGeometry(); // Array<Array<{x,y}>>

		for (const ring of rings) {
			// 1. Flatten the ring into earcut's format: [x0,y0, x1,y1, ...]
			//    while also doing the Y flip and the normalization.
			const flat: number[] = [];
			for (const pt of ring) {
				const nx = pt.x * scale;
				const ny = (extent - pt.y) * scale; // Y flip happens HERE
				flat.push(nx, ny);
			}

			// 2. Triangulate. earcut returns indices INTO `flat` (treating
			//    each pair as one vertex), telling us which vertices form
			//    each triangle: [tri0_a, tri0_b, tri0_c, tri1_a, ...]
			const triangleIndices = earcut(flat);

			// 3. Push the vertices into positions, adding Z=0 (we're flat for now)
			for (let j = 0; j < flat.length; j += 2) {
				positions.push(flat[j], flat[j + 1], 0);
			}

			// 4. Push the triangle indices, shifted by however many vertices
			//    were already in `positions` BEFORE this ring.
			for (const idx of triangleIndices) {
				indices.push(idx + vertexOffset);
			}

			vertexOffset += flat.length / 2;
		}
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
	geometry.setIndex(indices);
	geometry.computeVertexNormals();

	const material = new THREE.MeshBasicMaterial({
		color: 0xe2e2e2,
		side: THREE.DoubleSide // safety net while you figure out winding order
	});

	return new THREE.Mesh(geometry, material);
}

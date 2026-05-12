<!-- src/lib/components/TileMesh.svelte -->
<script lang="ts">
    import * as THREE from 'three';
    import { PMTiles } from 'pmtiles';
    import { VectorTile } from '@mapbox/vector-tile';
    import Protobuf from 'pbf';
    import { buildingsLayerToMesh } from '$lib/game/helper/tile-to-mesh';

    let container = $state<HTMLDivElement | null>(null);

    $effect(() => {
        if (!container) return;

        // --- Three.js boilerplate ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);

        // Our mesh lives in [0,1] x [0,1]. Frame it with a tiny margin.
        const camera = new THREE.OrthographicCamera(-0.05, 1.05, 1.05, -0.05, 0.1, 10);
        camera.position.set(0, 0, 2);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(800, 800);
        container.appendChild(renderer.domElement);

        let disposed = false;

        (async () => {
            const p = new PMTiles('/netherlands.pmtiles');

            // IMPORTANT: buildings only exist from zoom 11 upward (per your metadata).
            // Your z=7 tile WILL have no buildings layer. Use a z=14 tile over Amsterdam.
            const result = await p.getZxy(14, 8410, 5379);
            if (!result || disposed) return;

            const tile = new VectorTile(new Protobuf(result.data));
            const buildingsLayer = tile.layers.buildings;
            if (!buildingsLayer) {
                console.warn('No buildings layer in this tile');
                return;
            }

            const mesh = buildingsLayerToMesh(buildingsLayer);
            scene.add(mesh);
            renderer.render(scene, camera);
        })();

        return () => {
            disposed = true;
            renderer.dispose();
            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
    });
</script>

<div bind:this={container} class="h-[800px] w-[800px]"></div>
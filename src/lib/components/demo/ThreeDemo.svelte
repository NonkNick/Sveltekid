<script lang="ts">
	import { onMount } from "svelte";
	import type * as THREE from "three";

	import px from "./textures/cube/pisa/px.png";
	import nx from "./textures/cube/pisa/nx.png";
	import py from "./textures/cube/pisa/py.png";
	import ny from "./textures/cube/pisa/ny.png";
	import pz from "./textures/cube/pisa/pz.png";
	import nz from "./textures/cube/pisa/nz.png";

	interface Props {
		class?: string;
	}

	let { class: className = "" }: Props = $props();

	let canvasContainer = $state<HTMLDivElement>();

	onMount(() => {
		if (!canvasContainer) return;

		let disposed = false;
		let _teardown: (() => void) | undefined;

		(async () => {
			const THREE = await import("three");
			const { ParallaxBarrierEffect } = await import("three/addons/effects/ParallaxBarrierEffect.js");

			if (disposed) return;

			const spheres: THREE.Mesh[] = [];
			let mouseX = 0;
			let mouseY = 0;

			const w = canvasContainer!.clientWidth;
			const h = canvasContainer!.clientHeight;
			let halfX = w / 2;
			let halfY = h / 2;

			const camera = new THREE.PerspectiveCamera(60, w / h, 0.01, 100);
			camera.position.z = 3;

			const scene = new THREE.Scene();

			const textureCube = new THREE.CubeTextureLoader().load([px, nx, py, ny, pz, nz]);

			scene.background = textureCube;

			const geometry = new THREE.SphereGeometry(0.1, 32, 16);
			const material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube });

			for (let i = 0; i < 500; i++) {
				const mesh = new THREE.Mesh(geometry, material);
				mesh.position.x = Math.random() * 10 - 5;
				mesh.position.y = Math.random() * 10 - 5;
				mesh.position.z = Math.random() * 10 - 5;
				mesh.scale.setScalar(Math.random() * 3 + 1);
				scene.add(mesh);
				spheres.push(mesh);
			}

			const renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio(window.devicePixelRatio);
			canvasContainer!.appendChild(renderer.domElement);

			const effect = new ParallaxBarrierEffect(renderer);
			effect.setSize(w, h);

			function onMouseMove(e: MouseEvent) {
				mouseX = (e.clientX - halfX) / 100;
				mouseY = (e.clientY - halfY) / 100;
			}

			function onResize() {
				const nw = canvasContainer!.clientWidth;
				const nh = canvasContainer!.clientHeight;
				halfX = nw / 2;
				halfY = nh / 2;
				camera.aspect = nw / nh;
				camera.updateProjectionMatrix();
				effect.setSize(nw, nh);
			}

			function animate() {
				if (disposed) return;
				const timer = 0.0001 * Date.now();
				camera.position.x += (mouseX - camera.position.x) * 0.05;
				camera.position.y += (-mouseY - camera.position.y) * 0.05;
				camera.lookAt(scene.position);
				for (let i = 0; i < spheres.length; i++) {
					spheres[i].position.x = 5 * Math.cos(timer + i);
					spheres[i].position.y = 5 * Math.sin(timer + i * 1.1);
				}
				effect.render(scene, camera);
			}

			renderer.setAnimationLoop(animate);

			window.addEventListener("mousemove", onMouseMove);
			const ro = new ResizeObserver(onResize);
			ro.observe(canvasContainer!);

			_teardown = () => {
				disposed = true;
				renderer.setAnimationLoop(null);
				renderer.dispose();
				ro.disconnect();
				window.removeEventListener("mousemove", onMouseMove);
			};
		})();

		return () => {
			disposed = true;
			_teardown?.();
		};
	});
</script>

<div bind:this={canvasContainer} class="h-full w-full {className}"></div>

<script lang="ts">
	import { T, useTask } from "@threlte/core";
	import { interactivity, useTexture } from "@threlte/extras";
	import { OrbitControls, Stars, FakeGlowMaterial, Environment } from "@threlte/extras";
	import type { Mesh } from "three";
	import dayMap from "$lib/assets/8k_earth_daymap.jpg";
	import earthNormal from "$lib/assets/8k_earth_normal_map.jpg";
	import earthRough from "$lib/assets/8k_earth_roughness_map.jpg";
	import moonMap from "$lib/assets/2k_moon.jpg";
	import sunMap from "$lib/assets/2k_sun.jpg";
	import milkyWay from "$lib/assets/8k_stars_milky_way.jpg";

	interactivity();

	useTask((delta) => {});

	let earthRef = $state<Mesh>();

	const stars = {
		count: 5000,
		radius: 100,
		depth: 50,
		factor: 6,
		saturation: 1,
		lightness: 0.8,
		opacity: 1,
		fade: true,
		rounded: true,
		speed: 1
	};

	//ziet er eng uit, maar werkt gewoon. we take those
	const earthTexturePromise = useTexture({
		map: dayMap,
		normalMap: earthNormal,
		roughnessMap: earthRough
	});
	const moonTexturePromise = useTexture(moonMap);
	const sunTexturePromise = useTexture(sunMap);


	const EARTH_POSITION: [number, number, number] = [-8, 0, 0];
</script>

<T.PerspectiveCamera makeDefault position={[-8, 1, 5]} fov={50}>
	<OrbitControls
		target={EARTH_POSITION}
		enableDamping
		enablePan
		enableZoom

		autoRotate
		autoRotateSpeed={0.3}
	/>
</T.PerspectiveCamera>

{#if earthRef}
	<T.DirectionalLight position={[0, 0, 0]} target={earthRef} intensity={6} castShadow />
{/if}

<Environment
	isBackground=true
	url=milkyWay
/>

<Stars {...stars} />

{#await sunTexturePromise then texture}
	<T.Mesh position={[0, 0, 0]} scale={3}>
		<T.SphereGeometry args={[1, 64, 64]} />
		<T.MeshBasicMaterial map={texture} />
	</T.Mesh>
	<T.Mesh position={[0, 0, 0]} scale={7}>
		<T.SphereGeometry args={[1, 32, 32]} />
		<FakeGlowMaterial glowColor="orange" glowInternalRadius={6} />
	</T.Mesh>
{/await}

{#await earthTexturePromise then texture}
	<T.Mesh
		bind:ref={earthRef}
		position={EARTH_POSITION}
		castShadow
		receiveShadow
	>
		<T.SphereGeometry args={[1, 64, 64]} />
		<T.MeshStandardMaterial
			map={texture.map}
			normalMap={texture.normalMap}
			normalScale={[0.5, 0.5]}
			roughnessMap={texture.roughnessMap}
			roughness={1}
			metalness={0}
		/>
	</T.Mesh>
{/await}

{#await moonTexturePromise then texture}
	<T.Mesh position={[-6, 0, 0]} scale={0.27} castShadow receiveShadow>
		<T.SphereGeometry args={[1, 64, 64]} />
		<T.MeshStandardMaterial map={texture} />
	</T.Mesh>
{/await}

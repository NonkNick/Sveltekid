<script lang="ts">
	import { T, useTask } from "@threlte/core";
	import { interactivity, useTexture } from "@threlte/extras";
	import { OrbitControls, Stars, FakeGlowMaterial, Environment } from "@threlte/extras";
	import type { Mesh, Group } from "three";
	import dayMap from "$lib/assets/8k_earth_daymap.jpg";
	import earthNormal from "$lib/assets/8k_earth_normal_map.jpg";
	import earthRough from "$lib/assets/8k_earth_roughness_map.jpg";
	import moonMap from "$lib/assets/2k_moon.jpg";
	import sunMap from "$lib/assets/2k_sun.jpg";
	import milkyWay from "$lib/assets/milkyway_2020_8k_final.png";

	interactivity();

	const TAU = Math.PI * 2

	let speed = $state(1)
	let days = $state(0)
	const daysPerSecond = 1

	const PERIOD = {
		earthSpin:  1,
		earthOrbit: 365.25,
		moonOrbit:  27.32,
	}

	let earthRef = $state<Mesh>();
	let worldRef = $state<Group>();

	useTask((delta) => {
		days += delta * daysPerSecond * speed;

		// Move the world so Earth orbits around the camera
		// 3d is leuk, ja het is totaal logisch dat je niet de camera verplaatsts maar de wereld om je heen verplaatst natuurlijk
		if (worldRef) {
			worldRef.position.set(
				-earthPos[0],
				-earthPos[1],
				-earthPos[2]
			);
		}
	});

	let earthSpin  = $derived(days / PERIOD.earthSpin  * TAU)
	let earthOrbit = $derived(days / PERIOD.earthOrbit * TAU)
	let moonOrbit  = $derived(days / PERIOD.moonOrbit  * TAU)

	const earthRadius = 20
	const moonRadius  = 2
	const earthTilt   = 0.41

	let earthPos = $derived<[number, number, number]>(
		[Math.cos(earthOrbit) * earthRadius, 0, Math.sin(earthOrbit) * earthRadius]
	)
	let moonPos = $derived<[number, number, number]>(
		[Math.cos(moonOrbit) * moonRadius, 0, Math.sin(moonOrbit) * moonRadius]
	)
	const moonFaceOffset = Math.PI

	const camOffset: [number, number, number] = [-1.5, 1.5, 3.5]

	const stars = {
		count: 5000,
		radius: 10,
		depth: 50,
		factor: 2,
		saturation: 1,
		lightness: 0.8,
		opacity: 1,
		fade: true,
		rounded: true,
		speed: 1
	};

	const earthTexturePromise = useTexture({
		map: dayMap,
		normalMap: earthNormal,
		roughnessMap: earthRough
	});
	const moonTexturePromise = useTexture(moonMap);
	const sunTexturePromise = useTexture(sunMap);

</script>

<T.PerspectiveCamera makeDefault position={camOffset} fov={70}>
	<OrbitControls
		enableDamping
		enablePan
		enableZoom
		autoRotate
		autoRotateSpeed={-0.3}
	/>
</T.PerspectiveCamera>

{#if earthRef}
	<T.DirectionalLight position={[0, 0, 0]} target={earthRef} intensity={6} castShadow />
{/if}

<Environment isBackground url={milkyWay} />

<Stars {...stars} />

<!-- WORLD GROUP: Everything orbits inside this -->
<T.Group bind:ref={worldRef}>

	<!-- SUN -->
	{#await sunTexturePromise then texture}
		<T.Group position={[0, 0, 0]}>
			<T.Mesh position={[0, 0, 0]} scale={3}>
				<T.SphereGeometry args={[1, 64, 64]} />
				<T.MeshBasicMaterial map={texture} />
			</T.Mesh>
			<T.Mesh position={[0, 0, 0]} scale={7}>
				<T.SphereGeometry args={[1, 32, 32]} />
				<FakeGlowMaterial glowColor="orange" glowInternalRadius={6} />
			</T.Mesh>
		</T.Group>
	{/await}

	<!-- EARTH ASSEMBLY -->
	<T.Group position={earthPos}>
		<T.Group rotation.z={earthTilt}>
			{#await earthTexturePromise then texture}
				<T.Mesh
					rotation.y={earthSpin}
					bind:ref={earthRef}
					castShadow
					receiveShadow
				>
					<T.SphereGeometry args={[1, 128, 128]} />
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
		</T.Group>

		<!-- MOON -->
		<T.Group position={moonPos}>
			{#await moonTexturePromise then texture}
				<T.Mesh
					rotation.y={-moonOrbit + moonFaceOffset}
					castShadow
					receiveShadow
				>
					<T.SphereGeometry args={[0.3, 32, 32]} />
					<T.MeshStandardMaterial map={texture} />
				</T.Mesh>
			{/await}
		</T.Group>
	</T.Group>

</T.Group>
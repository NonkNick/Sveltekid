<script lang="ts">
	import { T, useTask } from "@threlte/core";
	import { interactivity, useTexture } from "@threlte/extras";
	import { OrbitControls, Stars, FakeGlowMaterial, Environment, Wobble } from "@threlte/extras";
	import type { Mesh, Group } from "three";
	import { Color } from "three";
	import { SheetObject, Sheet } from "@threlte/theatre";

	import dayMap from "$lib/assets/2k_earth_daymap.jpg";
	import earthNormal from "$lib/assets/2k_earth_normal_map.jpg";
	import earthRough from "$lib/assets/2k_earth_roughness_map.jpg";
	import earthNight from "$lib/assets/2k_earth_nightmap.jpg";
	import moonMap from "$lib/assets/2k_moon.jpg";
	import sunMap from "$lib/assets/2k_sun.jpg";
	import milkyWay from "$lib/assets/milkyway_2020_8k_final.png";

	// interactivity();

	const TAU = Math.PI * 2;
	const emissiveColor = new Color(1, 1, 1); // Create once, reuse

	let speed = $state(1);
	let days = $state(0);
	const daysPerSecond = 0.2;

	const PERIOD = {
		earthSpin: 1,
		earthOrbit: 365.25,
		moonOrbit: 27.32
	};

	let earthRef = $state<Mesh>();
	let worldRef = $state<Group>();

	let earthSpin = $derived((days / PERIOD.earthSpin) * TAU);
	let earthOrbit = $derived((days / PERIOD.earthOrbit) * TAU);
	let moonOrbit = $derived((days / PERIOD.moonOrbit) * TAU);

	const earthRadius = 20;
	const moonRadius = 2;
	const earthTilt = 0.41;

	let earthPos = $derived<[number, number, number]>([
		Math.cos(earthOrbit) * earthRadius,
		0,
		Math.sin(earthOrbit) * earthRadius
	]);
	let moonPos = $derived<[number, number, number]>([
		Math.cos(moonOrbit) * moonRadius,
		0,
		Math.sin(moonOrbit) * moonRadius
	]);
	const moonFaceOffset = Math.PI;

	const camOffset: [number, number, number] = [-1.5, 1.5, 3.5];

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
		roughnessMap: earthRough,
		emissiveMap: earthNight
	});

	const moonTexturePromise = useTexture(moonMap);
	const sunTexturePromise = useTexture(sunMap);

	useTask((delta) => {
		days += delta * daysPerSecond * speed;

		if (worldRef) {
			worldRef.position.set(-earthPos[0], -earthPos[1], -earthPos[2]);
		}
	});
</script>

<Sheet name="cameraSheet">
	<SheetObject key="camera">
		{#snippet children({ Transform, Sync })}
			<Transform>
				<T.PerspectiveCamera makeDefault position={camOffset} fov={70}>
					<!--TODO: voor animatie moet een refactor van orbitcontrols, want orbitcontrols manipuleert transform elke frame theatre.js probeert te animaten-->
					<OrbitControls enableDamping autoRotate autoRotateSpeed={-0.3} dampingFactor={0.05}>
						<Sync autoRotateSpeed />
					</OrbitControls>
					<h1>test</h1>
				</T.PerspectiveCamera>
			</Transform>
		{/snippet}
	</SheetObject>
</Sheet>

<Environment isBackground url={milkyWay} />

<Stars {...stars} />

<!-- WORLD GROUP: Everything orbits inside this -->
<T.Group bind:ref={worldRef}>
	{#if earthRef}
		<T.DirectionalLight
			position={[0, 0, 0]}
			target={earthRef}
			intensity={6}
			castShadow
			shadow.mapSize={[4096, 4096]}
			shadow.camera.far={100}
			shadow.camera.near={0.1}
			shadow.bias={-0.0001}
			shadow.normalBias={0.02}
		/>
	{/if}

	<!-- SUN -->
	{#await sunTexturePromise then texture}
		<T.Group position={[0, 0, 0]}>
			<T.Mesh position={[0, 0, 0]} scale={3}>
				<T.SphereGeometry args={[1, 32, 32]} />
				<T.MeshBasicMaterial map={texture} />
			</T.Mesh>
			<T.Mesh position={[0, 0, 0]} scale={7}>
				<T.SphereGeometry args={[1, 16, 16]} />
				<FakeGlowMaterial glowColor="orange" glowInternalRadius={6} />
			</T.Mesh>
		</T.Group>
	{/await}

	<!-- EARTH ASSEMBLY -->

	<T.Group position={earthPos}>
		<Sheet name="cameraSheet">
			<SheetObject key="wobble" props={{ speed: 2, factor: 2 }}>
				{#snippet children({ Transform, Sync, values  })}
					<Transform>
						<T.Group rotation.z={earthTilt}>
							{#await earthTexturePromise then texture}
								<T.Mesh rotation.y={earthSpin} bind:ref={earthRef} castShadow receiveShadow>
									<T.SphereGeometry args={[1, 128, 128]} />
									<T.MeshStandardMaterial
										map={texture.map}
										normalMap={texture.normalMap}
										normalScale={[0.5, 0.5]}
										roughnessMap={texture.roughnessMap}
										roughness={1.2}
										metalness={0}
										emissiveMap={texture.emissiveMap}
										emissive={emissiveColor}
										emissiveIntensity={0.5}
									/>
									<Wobble speed={values.speed} factor={values.factor} />
								</T.Mesh>
							{/await}
						</T.Group>
					</Transform>
				{/snippet}
			</SheetObject>
		</Sheet>

		<!-- MOON -->
		<T.Group position={moonPos}>
			{#await moonTexturePromise then texture}
				<T.Mesh rotation.y={-moonOrbit + moonFaceOffset} castShadow receiveShadow>
					<T.SphereGeometry args={[0.3, 16, 16]} />
					<T.MeshStandardMaterial map={texture} />
				</T.Mesh>
			{/await}
		</T.Group>
	</T.Group>
</T.Group>

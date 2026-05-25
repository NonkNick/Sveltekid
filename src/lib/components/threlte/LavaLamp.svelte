<script lang="ts">
	import { T, useTask } from "@threlte/core";
	import { interactivity } from "@threlte/extras";
	import { OrbitControls, Stars, Grid } from "@threlte/extras";
	import { Spring } from "svelte/motion";
	import { SheetObject } from "@threlte/theatre";

	interactivity();

	const scale = new Spring(1);

	let rotation = $state(0);

	useTask((delta) => {
		rotation += delta;
	});

	// hardcoded star settings
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
</script>

<!-- Camera -->
<T.PerspectiveCamera makeDefault position={[2, 1, 5]} fov={50}>
	<OrbitControls enableDamping enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.3} />
</T.PerspectiveCamera>

<!-- Lights -->
<T.AmbientLight intensity={0.5} />

<T.DirectionalLight position={[5, 5, 5]} intensity={1.5} castShadow />

<T.PointLight position={[-5, 3, -5]} intensity={0.6} />

<!-- Stars -->
<Stars {...stars} />

<!-- Your cube -->
<!--todo: sheetobject fixen zodat scene niet fuckt.-->
<T.Mesh receiveShadow castShadow position.y={0.5}>
	<T.BoxGeometry args={[1, 2, 1]} />

	<T.MeshStandardMaterial color="#b00d03"></T.MeshStandardMaterial>
</T.Mesh>

<script lang="ts">
	import CanvasPortalTarget from '$lib/components/CanvasPortalTarget.svelte'
	import { Canvas } from '@threlte/core'
	import type { Snippet } from 'svelte'
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import favicon from "$lib/assets/favicon.svg";
	import Navbar from "$lib/components/Navbar.svelte";

	let { children } = $props();

</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div>
	<Canvas>
		<CanvasPortalTarget />
	</Canvas>
</div>
<ModeWatcher />

<Navbar></Navbar>


<main class="pt-0 pb-16 md:pt-16 md:pb-0 min-h-screen">
	{@render children()}
</main>

<style>
	div {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;

	}
</style>
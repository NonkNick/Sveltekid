<script lang="ts">
	import { page } from "$app/state";
	import CanvasPortalTarget from "$lib/components/CanvasPortalTarget.svelte";
	import { Canvas } from "@threlte/core";
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import favicon from "$lib/assets/favicon.svg";
	import Navbar from "$lib/components/Navbar.svelte";
	import { WebGLRenderer } from "three";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import tester from "$lib/animations/tester.json";
	import { Project, Sequence, Sheet, type SequenceController } from "@threlte/theatre";

	let { children } = $props();

	//hacky manier zodat svelte meewerkt, verwijder buiten dev
	const isStudio = $derived(page.url.pathname.startsWith("/studio"));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if !isStudio}
	<div class="canvas-bg">
		<Canvas>
			<Project config={{ state: tester }}>
				<Sheet name="cameraSheet">
					<CanvasPortalTarget />
					<Sequence autoplay iterationCount={Infinity} />
				</Sheet>
			</Project>
		</Canvas>
	</div>
{/if}

<ModeWatcher />
<Toaster />

{#if !isStudio}
	<Navbar />
{/if}

<main class="min-h-screen pt-0 pb-16 md:pt-16 md:pb-0">
	{@render children?.()}
</main>

<style>
	.canvas-bg {
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
	}
</style>

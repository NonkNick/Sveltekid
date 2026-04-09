<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import favicon from "$lib/assets/favicon.svg";
	import Navbar from "$lib/components/Navbar.svelte";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />

<Navbar></Navbar>

<main class="pt-0 pb-16 md:pt-16 md:pb-0 min-h-screen">
	{@render children()}
</main>

<script lang="ts">
	import "./layout.css";
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import Navbar from "$lib/components/Navbar.svelte";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Navbar></Navbar>

<main class="min-h-screen pt-0 pb-16 md:pt-16 md:pb-0">
	{@render children()}
</main>
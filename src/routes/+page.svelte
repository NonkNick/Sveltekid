<script lang="ts">
	import BabylonDemo from "$lib/components/demo/BabylonDemo.svelte";
	import ToggleButton from "$lib/components/ui/ToggleButton.svelte";
	import {Button} from "$lib/components/ui/button";
</script>

<svelte:head>
	<title>Svelte Basics</title>
</svelte:head>

<!--<BabylonDemo />-->
<main class="max-w-[860px] mx-auto px-5 py-12 grid gap-[18px]">
	<header class="p-[22px] border border-border rounded-2xl bg-card text-card-foreground backdrop-blur-sm">
		<span class="inline-block text-xs font-bold tracking-widest uppercase px-[10px] py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive">Svelte</span>
		<h1 class="mt-3 mb-1.5 text-[40px] leading-tight">yarr</h1>
		<ToggleButton class="h-10">test</ToggleButton>
		<p class="mb-3.5 text-muted-foreground">
			A tiny page showing: <code class="bg-muted px-1.5 py-0.5 rounded-md">$:</code> reactive statements, bindings, events, and templating.
		</p>
	</header>

</main>

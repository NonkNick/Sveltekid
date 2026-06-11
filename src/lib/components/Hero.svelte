<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { ui } from "$lib/stores/ui.svelte";
	import ChevronUp from "@lucide/svelte/icons/chevron-up";
	import { Spring } from 'svelte/motion';

	// $effect(() => {
	// 	if (isDragging) {
	// 		y.set(pointerY - startY, { hard: true });
	// 	}
	// });
	//
	const springyBoy = new Spring(0);

	let pos = $state({x: 0, y: 0});
	let dragging = $state(false);

	function onpointermove(event: PointerEvent) {
		console.log("move: " + event.clientX, event.clientY);


	}

	function onpointerup(event: PointerEvent) {
		console.log("up: " + event.clientX, event.clientY);
	}

	function onpointerdown(event: PointerEvent) {
		console.log("down: " + event.clientX, event.clientY);
	}




</script>
<svelte:window {onpointermove} {onpointerup} {onpointerdown}/>
<div class="flex h-dvh w-full flex-col items-center justify-end overflow-hidden">
	{#if !ui.hidden}
<!--		<Button onclick={() => (ui.hidden = !ui.hidden)} variant="positive" size="xl" class="w-[100px]">Play</Button>-->

		<span class="animate-bounce">
					<ChevronUp size={112} strokeWidth={0.8} class="mb-7 text-(--navbar-accent)/70" />
		</span>

		<div class="bg-amber-200 w-[100px]" style="height: {springyBoy.current}px"></div>
		<Button onclick={() => (springyBoy.target = springyBoy.target === 150 ? 0 : 150)}>test</Button>

	{/if}
</div>


<style>

</style>

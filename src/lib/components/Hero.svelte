<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { ui } from "$lib/stores/ui.svelte";
	import ChevronUp from "@lucide/svelte/icons/chevron-up";

	// onMount(() => {
	//     import("$lib/game/main");
	// });

	// import { spring } from 'svelte/motion';
	//
	// let isDragging = $state(false);
	// let startY = $state(0);
	// let pointerY = $state(0);
	// let y = spring(0, { stiffness: 0.2, damping: 0.8 });
	//
	// $effect(() => {
	// 	if (isDragging) {
	// 		y.set(pointerY - startY, { hard: true });
	// 	}
	// });
	//
	// function onpointerdown(e) {
	// 	isDragging = true;
	// 	startY = e.clientY;
	// }
	//
	// function onpointermove(e) {
	// 	if (!isDragging) return;
	// 	pointerY = e.clientY;
	// }
	//
	// function onpointerup() {
	// 	isDragging = false;
	// 	y.set(0);
	// } AI SLOP MAAR GOED OVERZICHT VAN SHIT, NIET IETS WAT AI GOED LIJKT TE SNAPPEN


</script>

<div class="flex h-dvh w-full flex-col items-center justify-end overflow-hidden">
	{#if !ui.hidden}
		<Button onclick={() => (ui.hidden = !ui.hidden)} variant="positive" size="xl" class="w-[100px]">Play</Button>

		<span class="animate-bounce">
					<ChevronUp size={112} strokeWidth={0.8} class="mb-7 text-(--navbar-accent)/50" />
		</span>

	{/if}
</div>


<style>
</style>

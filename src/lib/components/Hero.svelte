<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { ui } from "$lib/stores/ui.svelte";
	import ChevronUp from "@lucide/svelte/icons/chevron-up";

	// onMount(() => {
	//     import("$lib/game/main");
	// });
</script>

<div class="flex h-dvh w-full flex-col items-center justify-end overflow-hidden">
	{#if !ui.hidden}
		<Button onclick={() => (ui.hidden = !ui.hidden)} variant="positive" size="xl" class="w-[100px]">Play</Button>
		<ChevronUp size={128} strokeWidth={0.75} class="mb-8 scale-x-150 text-white" />
	{/if}
</div>

<style>
</style>

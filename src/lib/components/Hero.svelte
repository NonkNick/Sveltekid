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
<!--		<Button onclick={() => (ui.hidden = !ui.hidden)} variant="positive" size="xl" class="w-[100px]">Play</Button>-->

		<span class="animate-bounce">
					<ChevronUp size={112} strokeWidth={0.8} class="mb-7 text-(--navbar-accent)/50" />
		</span>
		<span class="animate-[bounce_1s]">
					<ChevronUp size={112} strokeWidth={0.8} class="mb-7 text-(--navbar-accent)/50" />
		</span>
<!--		<ChevronUp size={128} strokeWidth={0.5} class="mb-8 scale-x-150 text-white animate-ping" />-->


	{/if}
</div>


<style>
</style>

<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		checked?: boolean;
		class?: string;
		children: Snippet;
		onToggle?: (next: boolean) => void;
	}

	let { checked = false, class: className = "", children, onToggle }: Props = $props();

	function handleClick() {
		onToggle?.(!checked);
	}
</script>

<button
	type="button"
	class={`bg-accent inset-shadow-sm/100 flex aspect-2/1 cursor-pointer items-center rounded-full text-center transition-all duration-200 ${
		checked ? "justify-end" : "justify-start"
	} ${className}`}
	onclick={handleClick}
>
	<div class="bg-black/50 aspect-square h-full rounded-full">
		{@render children()}
	</div>
</button>

<style>
</style>

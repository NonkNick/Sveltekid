<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		href?: string;
		children: Snippet;
	}

	let { href = "#", children }: Props = $props();
</script>

<div
	class="hover:inset-shadow-sm grid h-full place-items-center rounded-full
			text-center"
>
	<a {href}>
		{@render children()}
	</a>
</div>

<style>
</style>

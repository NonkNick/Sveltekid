<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		href?: string;
		children: Snippet;
	}

	let { href = "#", children }: Props = $props();
</script>

<div
	class="grid h-full place-items-center rounded-full text-center
			hover:inset-shadow-sm"
>
	<a {href}>
		{@render children()}
	</a>
</div>

<style>
</style>

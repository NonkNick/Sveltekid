<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		href?: string;
		children: Snippet;
	}

	let { href = "#", children }: Props = $props();
</script>

<div class="rounded-full h-full grid place-items-center text-center
			hover:inset-shadow-sm">
	<a {href}>
		{@render children()}
	</a>
</div>

<style>
</style>

<script lang="ts">
	import { addCanvasPortalSnippet, removeCanvasPortalSnippet } from "$lib/components/CanvasPortalTarget.svelte";
	import { onDestroy, type Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();


	$effect(() => {                              // $effect — Svelte rune, client-only, runs post-flush
		addCanvasPortalSnippet(children);
		return () => removeCanvasPortalSnippet(children); // cleanup runs on unmount + before re-run
	});
</script>

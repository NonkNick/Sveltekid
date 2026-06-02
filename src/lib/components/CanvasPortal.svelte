<script lang="ts">
	import { addCanvasPortalSnippet, removeCanvasPortalSnippet } from "$lib/components/CanvasPortalTarget.svelte";
	import { type Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();

	$effect(() => {
		// Capture the snippet now (mount): reading the reactive `children` prop again inside
		// the cleanup can yield a stale/torn-down value, so the snippet would never be removed
		// from the module-level set and would keep rendering (and looping) on every later page.
		const snippet = children;
		addCanvasPortalSnippet(snippet);
		return () => removeCanvasPortalSnippet(snippet);
	});
</script>

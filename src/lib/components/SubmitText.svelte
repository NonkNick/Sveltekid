<script lang="ts">
	import { page } from "$app/state";
	import { EdraEditor, EdraToolBar } from "$lib/components/edra/shadcn";
	import type { Content, Editor } from "@tiptap/core";
	import { Button } from "$lib/components/ui/button";
	import * as Alert from "$lib/components/ui/alert/index.js";

	import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
	import SendHorizontal from "@lucide/svelte/icons/send-horizontal";

	const user = $derived(page.data.user);

	// Editor states
	let content = $state<Content>();
	let editor = $state<Editor>();
	function onUpdate() {
		content = editor?.getJSON();
		console.log(content);
	}
	export function getContent() {
		return editor?.getJSON();
	}

	async function submit() {
		if (!user) {
			// handle not logged in
			return;
		}
		await fetch("/api/posts", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title: "Untitled", content: editor?.getJSON() })
		});
	}
</script>

{#if user !== null}
	<div class="flex flex-row items-center justify-between">
		<!--	TODO: shit is voor voorbeeld, ding is heavy dus niet laden zolang er geen tekst gemaakt word. ook de nutteloze onderdelen nog verwijderen.-->

		<div class="bg-background rounded-md border border-dashed">
			{#if editor && !editor.isDestroyed}
				<EdraToolBar
					class="bg-secondary/50 p-0.5 flex w-full items-center overflow-x-auto border-b border-dashed"
					{editor}
				/>
			{/if}
			<EdraEditor bind:editor {content} class="h-24 max-h-120 pr-2 pl-6 overflow-y-scroll" {onUpdate} />
		</div>
		<Button size="icon-lg" onclick={submit}>
			<SendHorizontal />
			<!--    Submit-->
		</Button>
	</div>
{:else}
	<Alert.Root variant="destructive">
		<AlertCircleIcon />
		<Alert.Title>Not logged in .</Alert.Title>
		<Alert.Description>
			<p>This submission component only works when logged in.</p>
			<ul class="text-sm list-inside list-disc">
				<li>Go log in</li>
			</ul>
		</Alert.Description>
	</Alert.Root>

{/if}

<style>
</style>

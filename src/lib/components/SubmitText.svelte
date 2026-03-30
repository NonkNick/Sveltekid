<script lang="ts">
    import { EdraEditor, EdraToolBar, EdraDragHandleExtended } from '$lib/components/edra/shadcn';
    import type { Content, Editor } from '@tiptap/core';

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
</script>

<!--	TODO: shit is voor voorbeeld, ding is heavy dus niet laden zolang er geen tekst gemaakt word. ook de nutteloze onderdelen nog verwijderen.-->
<div class="bg-background mt-12 rounded-md border border-dashed">
    {#if editor && !editor.isDestroyed}
        <EdraToolBar
                class="bg-secondary/50 flex w-full items-center overflow-x-auto border-b border-dashed p-0.5"
                {editor}
        />
        <EdraDragHandleExtended {editor} />
    {/if}
    <EdraEditor
            bind:editor
            {content}
            class="h-120 max-h-120 overflow-y-scroll pr-2 pl-6"
            {onUpdate}
    />

</div>

<style>

</style>
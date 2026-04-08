<script lang="ts">
	import type { NodeViewProps } from "@tiptap/core";

	const { editor }: NodeViewProps = $props();

	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import CodeXml from "@lucide/svelte/icons/code-xml";
	import { NodeViewWrapper } from "svelte-tiptap";
	import strings from "../../strings.js";

	let open = $state(false);
	let iframUrl = $state("");

	function handleSubmit(e: Event) {
		e.preventDefault();
		open = false;
		editor.chain().focus().setIframe({ src: iframUrl }).run();
	}
</script>

<NodeViewWrapper
	as="div"
	contenteditable="false"
	class={buttonVariants({
		variant: "secondary",
		class: "media-placeholder my-4! p-6 relative w-full justify-start"
	})}
	style="user-select: none;"
	draggable={true}
	onclick={() => (open = true)}
>
	<CodeXml />
	<span>{strings.extension.iframe.insertPlaceholder}</span>
	<Popover.Root bind:open>
		<Popover.Trigger class="sr-only absolute left-1/2">{strings.extension.iframe.openButton}</Popover.Trigger>
		<Popover.Content
			onCloseAutoFocus={(e) => e.preventDefault()}
			contenteditable={false}
			class="bg-popover w-96 p-4 transition-all duration-300"
			portalProps={{ disabled: true, to: undefined }}
		>
			<form onsubmit={handleSubmit} class="gap-2 flex flex-col">
				<Input placeholder={strings.extension.iframe.embedLinkPlaceholder} bind:value={iframUrl} required type="url" />
				<Button type="submit" variant="secondary">{strings.extension.iframe.embedLinkButton}</Button>
			</form>
		</Popover.Content>
	</Popover.Root>
</NodeViewWrapper>

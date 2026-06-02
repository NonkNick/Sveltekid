<script lang="ts">
	import type { CommentNode } from "$lib/server/queries/posts";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import ArrowBigUpIcon from "@lucide/svelte/icons/arrow-big-up";
	import ArrowBigDownIcon from "@lucide/svelte/icons/arrow-big-down";
	import ReplyIcon from "@lucide/svelte/icons/reply";
	import MessageSquareIcon from "@lucide/svelte/icons/message-square";
	import { enhance } from "$app/forms";
	import { toast } from "svelte-sonner";
	import type { ActionResult } from "@sveltejs/kit";

	let { comments, currentUserId = null }: { comments: CommentNode[]; currentUserId?: string | null } = $props();

	// which comment currently has its reply box open
	let replyingTo = $state<string | null>(null);

	const signedIn = $derived(!!currentUserId);

	function initials(name: string) {
		return name
			.split(" ")
			.map((p) => p[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();
	}

	function handleResult(onSuccess?: () => void) {
		return async ({
			result,
			update
		}: {
			result: ActionResult;
			update: (options?: { reset?: boolean }) => Promise<void>;
		}) => {
			if (result.type === "success") {
				onSuccess?.();
				await update();
			} else if (result.type === "failure") {
				toast.error((result.data as any)?.message ?? "Something went wrong");
			} else if (result.type === "error") {
				toast.error("Something went wrong");
			}
		};
	}
</script>

<!-- recursive renderer for a comment and all of its nested replies -->
{#snippet commentItem(node: CommentNode)}
	<div class="flex gap-3">
		<div class="flex flex-col items-center gap-0.5 pt-1">
			<form method="POST" action="?/vote" use:enhance={() => handleResult()}>
				<input type="hidden" name="commentId" value={node.id} />
				<!-- toggle off when already upvoted, otherwise upvote -->
				<input type="hidden" name="value" value={node.userVote === 1 ? 0 : 1} />
				<Button
					type="submit"
					variant="ghost"
					size="icon"
					class="size-7 {node.userVote === 1 ? 'text-orange-500' : ''}"
					disabled={!signedIn}
					aria-label="Upvote"
				>
					<ArrowBigUpIcon class="size-4" />
				</Button>
			</form>

			<span class="text-sm font-medium tabular-nums">{node.score}</span>

			<form method="POST" action="?/vote" use:enhance={() => handleResult()}>
				<input type="hidden" name="commentId" value={node.id} />
				<input type="hidden" name="value" value={node.userVote === -1 ? 0 : -1} />
				<Button
					type="submit"
					variant="ghost"
					size="icon"
					class="size-7 {node.userVote === -1 ? 'text-blue-500' : ''}"
					disabled={!signedIn}
					aria-label="Downvote"
				>
					<ArrowBigDownIcon class="size-4" />
				</Button>
			</form>
		</div>

		<div class="flex-1">
			<div class="flex items-center gap-2">
				<Avatar.Root class="size-6">
					{#if node.authorImage}
						<Avatar.Image src={node.authorImage} alt={node.authorName} />
					{/if}
					<Avatar.Fallback class="text-xs">{initials(node.authorName)}</Avatar.Fallback>
				</Avatar.Root>
				<span class="text-sm font-medium">{node.authorName}</span>
				<span class="text-xs text-muted-foreground">
					{new Date(node.createdAt).toLocaleDateString()}
				</span>
			</div>

			<p class="mt-1 text-sm whitespace-pre-wrap">{node.content}</p>

			{#if signedIn}
				<Button
					variant="ghost"
					size="sm"
					class="mt-1 h-7 px-2 text-xs"
					onclick={() => (replyingTo = replyingTo === node.id ? null : node.id)}
				>
					<ReplyIcon class="size-3.5" />
					Reply
				</Button>
			{/if}

			{#if replyingTo === node.id}
				<form
					method="POST"
					action="?/comment"
					class="mt-2 grid gap-2"
					use:enhance={() =>
						handleResult(() => {
							replyingTo = null;
							toast.success("Reply posted");
						})}
				>
					<input type="hidden" name="parentId" value={node.id} />
					<Textarea name="content" placeholder="Write a reply…" required class="min-h-16" />
					<div class="flex gap-2">
						<Button type="submit" size="sm">Reply</Button>
						<Button type="button" variant="ghost" size="sm" onclick={() => (replyingTo = null)}>Cancel</Button>
					</div>
				</form>
			{/if}

			{#if node.replies.length > 0}
				<div class="mt-3 grid gap-3 border-l border-muted pl-3">
					{#each node.replies as reply (reply.id)}
						{@render commentItem(reply)}
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/snippet}

<section class="grid gap-4">
	<h2 class="flex items-center gap-2 text-lg font-semibold">
		<MessageSquareIcon class="size-5" />
		Comments
	</h2>

	{#if signedIn}
		<form
			method="POST"
			action="?/comment"
			class="grid gap-2"
			use:enhance={() => handleResult(() => toast.success("Comment posted"))}
		>
			<Textarea name="content" placeholder="Add a comment…" required class="min-h-20" />
			<div>
				<Button type="submit" size="sm">Comment</Button>
			</div>
		</form>
	{:else}
		<p class="text-sm text-muted-foreground">Sign in to join the conversation.</p>
	{/if}

	{#if comments.length === 0}
		<p class="text-sm text-muted-foreground">No comments yet. Be the first!</p>
	{:else}
		<div class="grid gap-5">
			{#each comments as node (node.id)}
				{@render commentItem(node)}
			{/each}
		</div>
	{/if}
</section>

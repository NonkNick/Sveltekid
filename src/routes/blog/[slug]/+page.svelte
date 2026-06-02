<script lang="ts">
	import BlogPost from "$lib/components/BlogPost.svelte";
	import Comments from "$lib/components/Comments.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	const post = $derived(data.post);
	const comments = $derived(data.comments);
</script>

<div class="mx-auto grid max-w-[860px] gap-[18px] px-5 py-12">
	<Button href="/" variant="ghost" size="sm" class="w-fit gap-1.5 px-2">
		<ArrowLeftIcon class="size-4" />
		Back
	</Button>
	<BlogPost {post} />
	<Comments {comments} currentUserId={data.user?.id ?? null} />
</div>

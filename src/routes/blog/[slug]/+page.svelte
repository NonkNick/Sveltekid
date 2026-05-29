<script lang="ts">
	import BlogPost from "$lib/components/BlogPost.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	const { post } = data;
</script>

<BlogPost {post}/>

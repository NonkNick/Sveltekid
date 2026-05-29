<script lang="ts">
	import BlogPost from "$lib/components/BlogPost.svelte";
	import type { PageProps } from "./$types";
	import { Button } from "$lib/components/ui/button";


	let { data }: PageProps = $props();
	const { post } = data;
</script>
<div transition:fly={{ y: 150, duration: 300 }} class="mx-auto grid max-w-[860px] gap-[18px] px-5 py-12">
	<button>test</button>
	<BlogPost {post}/>
</div>
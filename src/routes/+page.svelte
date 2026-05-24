<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import type { PageProps } from './$types';
	import BlogPost from "$lib/components/BlogPost.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import { ui } from "$lib/stores/ui.svelte";
	import { fly } from 'svelte/transition';
	import CanvasPortal from '$lib/components/CanvasPortal.svelte';
	import LavaLamp from "$lib/components/threlte/LavaLamp.svelte";
	import TestScene from "$lib/components/threlte/TestScene.svelte";

	import SubmitText from "$lib/components/SubmitText.svelte";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Button } from "$lib/components/ui/button";
	import SendHorizontal from "@lucide/svelte/icons/send-horizontal";


	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Svelte Basics</title>
</svelte:head>


<Hero></Hero>
<CanvasPortal>
	<LavaLamp />
</CanvasPortal>

<!--<SubmitText></SubmitText>-->
{#if !ui.hidden}
	<div transition:fly={{ y: 150, duration: 300 }} class="px-5 py-12 mx-auto grid max-w-[860px] gap-[18px]">
		<header class="border-border rounded-2xl bg-card text-card-foreground backdrop-blur-sm border p-[22px]">
			<span
				class="text-xs font-bold tracking-widest py-1.5 bg-destructive/10 border-destructive/20 text-destructive inline-block rounded-full border px-[10px] uppercase"
			>Svelte</span>
			<h1 class="mt-3 mb-1.5 leading-tight text-[40px]">yarr</h1>
			<p class="mb-3.5 text-muted-foreground">
				A tiny page showing: <code class="bg-muted px-1.5 py-0.5 rounded-md">$:</code> reactive statements, bindings, events,
				and templating.
			</p>
		</header>

		<Card.Root>
			<Card.Content class="flex flex-row items-center gap-4">
				test
				<Textarea />
				<Button size="icon-lg" >
					<SendHorizontal />
					<!--    Submit-->
				</Button>
			</Card.Content>
		</Card.Root>

		{#each data.posts as post (post.id)}
			<BlogPost {post} />
		{:else}

			<Card.Root class="w-full">
				<Card.Content>No posts yet.</Card.Content>
			</Card.Root>
		{/each}

	</div>
{/if}
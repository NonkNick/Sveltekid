<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import type { PageProps } from "./$types";
	import BlogPost from "$lib/components/BlogPost.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import { ui } from "$lib/stores/ui.svelte";
	import { fly } from "svelte/transition";
	import CanvasPortal from "$lib/components/CanvasPortal.svelte";
	import LavaLamp from "$lib/components/threlte/LavaLamp.svelte";
	import TestScene from "$lib/components/threlte/TestScene.svelte";

	import SubmitText from "$lib/components/SubmitText.svelte";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Button } from "$lib/components/ui/button";
	import SendHorizontal from "@lucide/svelte/icons/send-horizontal";
	import Earth from "$lib/components/threlte/Earth.svelte";

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Svelte Basics</title>
</svelte:head>

<Hero></Hero>
<CanvasPortal>
	<Earth />
</CanvasPortal>

<!--<SubmitText></SubmitText>-->
{#if !ui.hidden}
	<div transition:fly={{ y: 150, duration: 300 }} class="mx-auto grid max-w-[860px] gap-[18px] px-5 py-12">
		<header class="rounded-2xl border border-border bg-card p-[22px] text-card-foreground backdrop-blur-sm">
			<span
				class="inline-block rounded-full border border-destructive/20 bg-destructive/10 px-[10px] py-1.5 text-xs font-bold tracking-widest text-destructive uppercase"
				>Svelte</span
			>
			<h1 class="mt-3 mb-1.5 text-[40px] leading-tight">yarr</h1>
			<p class="mb-3.5 text-muted-foreground">
				A tiny page showing: <code class="rounded-md bg-muted px-1.5 py-0.5">$:</code> reactive statements, bindings, events,
				and templating.
			</p>
		</header>

		<Card.Root>
			<Card.Content class="flex flex-row items-center gap-4">
				test
				<Textarea />
				<Button size="icon-lg">
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

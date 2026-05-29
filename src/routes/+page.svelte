<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import type { PageProps } from "./$types";
	import BlogPost from "$lib/components/BlogPost.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import { ui } from "$lib/stores/ui.svelte";
	import { fly } from "svelte/transition";
	import CanvasPortal from "$lib/components/CanvasPortal.svelte";

	import { Textarea } from "$lib/components/ui/textarea";
	import { Button } from "$lib/components/ui/button";
	import SendHorizontal from "@lucide/svelte/icons/send-horizontal";
	import Earth from "$lib/components/threlte/Earth.svelte";
	import { Input } from "$lib/components/ui/input";

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

		<form method="POST">
			<Card.Root>
				<Card.Content class="flex flex-col items-stretch gap-4">
					<Input name="title" placeholder="Title" />

					<div class="flex flex-row items-center gap-4">
						<Textarea name="content" placeholder="Write something..." />
						<Button type="submit" size="icon-lg">
							<SendHorizontal />
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</form>

		{#each data.posts as post (post.slug)}
			<a href={`/blog/${post.slug}`}>
				<BlogPost {post} />
			</a>
		{:else}
			<Card.Root class="w-full">
				<Card.Content>No posts yet.</Card.Content>
			</Card.Root>
		{/each}
	</div>
{/if}

<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card/index.js";
	import SubmitText from "$lib/components/SubmitText.svelte";
	import type { PageProps } from './$types';
	import BlogPost from "$lib/components/BlogPost.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import {ui} from "$lib/stores/ui.svelte";
	import { fly } from 'svelte/transition';


	let { data }: PageProps = $props();


	// console.log(data);

</script>

<svelte:head>
	<title>Svelte Basics</title>
</svelte:head>


<Hero></Hero>
{#if !ui.hidden}
	<div transition:fly={{ y: 150, duration: 300 }} class="px-5 py-12 mx-auto grid max-w-[860px] gap-[18px]">
		<header class="border-border rounded-2xl bg-card text-card-foreground backdrop-blur-sm border p-[22px]">
		<span
				class="text-xs font-bold tracking-widest py-1.5 bg-destructive/10 border-destructive/20 text-destructive inline-block rounded-full border px-[10px] uppercase"
		>Svelte</span
		>
			<h1 class="mt-3 mb-1.5 leading-tight text-[40px]">yarr</h1>
			<p class="mb-3.5 text-muted-foreground">
				A tiny page showing: <code class="bg-muted px-1.5 py-0.5 rounded-md">$:</code> reactive statements, bindings, events,
				and templating.
			</p>
		</header>



<!--		{#each data as post}-->
<!--			<BlogPost {post} />-->
<!--		{/each}-->

		<Card.Root class="w-full">
			<Card.Content>
				PLACEHOLDER
				<!--			<SubmitText />-->
			</Card.Content>
		</Card.Root>
	</div>
{/if}
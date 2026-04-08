<script lang="ts">
	import BabylonDemo from "$lib/components/demo/BabylonDemo.svelte";
	import ToggleButton from "$lib/components/ui/ToggleButton.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card/index.js";
	import SubmitText from "$lib/components/SubmitText.svelte";
</script>

<svelte:head>
	<title>Svelte Basics</title>
</svelte:head>

<!--<BabylonDemo />-->
<main class="px-5 py-12 mx-auto grid max-w-[860px] gap-[18px]">
	<header class="border-border rounded-2xl bg-card text-card-foreground backdrop-blur-sm border p-[22px]">
		<span
			class="text-xs font-bold tracking-widest py-1.5 bg-destructive/10 border-destructive/20 text-destructive inline-block rounded-full border px-[10px] uppercase"
			>Svelte</span
		>
		<h1 class="mt-3 mb-1.5 leading-tight text-[40px]">yarr</h1>
		<ToggleButton class="h-10">test</ToggleButton>
		<p class="mb-3.5 text-muted-foreground">
			A tiny page showing: <code class="bg-muted px-1.5 py-0.5 rounded-md">$:</code> reactive statements, bindings, events,
			and templating.
		</p>
	</header>

	<Card.Root class="glass w-full">
		<Card.Header>
			<Card.Title>this is card for example yes</Card.Title>
			<Card.Description>description of tha card aa</Card.Description>
			<Card.Action>
				<Button variant="link">a button but link</Button>
			</Card.Action>
		</Card.Header>
		<Card.Content></Card.Content>
		<Card.Footer class="gap-2 flex-col">
			<Button type="submit" class="w-full">button</Button>
		</Card.Footer>
	</Card.Root>

	<Card.Root class="glass w-full">
		<!--		<Card.Header>-->
		<!--			<Card.Title>this is card for example yes</Card.Title>-->
		<!--			<Card.Description-->
		<!--			>description of tha card aa</Card.Description-->
		<!--			>-->
		<!--			<Card.Action>-->
		<!--				<Button variant="link">a button but link</Button>-->
		<!--			</Card.Action>-->
		<!--		</Card.Header>-->
		<Card.Content>
			<SubmitText />
		</Card.Content>
		<!--		<Card.Footer class="flex-col gap-2">-->
		<!--			<Button type="submit" class="w-full">button</Button>-->
		<!--		</Card.Footer>-->
	</Card.Root>
</main>

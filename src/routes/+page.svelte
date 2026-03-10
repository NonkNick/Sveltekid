<!-- src/routes/+page.svelte -->
<script lang="ts">
	import BabylonDemo from "$lib/components/demo/BabylonDemo.svelte";
	import ToggleButton from "$lib/components/ui/ToggleButton.svelte";
</script>

<svelte:head>
	<title>Svelte Basics</title>
</svelte:head>

<main class="page">
	<header class="hero">
		<span class="badge">Svelte</span>
		<h1>yarr</h1>
		<ToggleButton class="h-10">test</ToggleButton>
		<p class="sub">
			A tiny page showing: <code>$:</code> reactive statements, bindings, events, and templating.
		</p>

		<BabylonDemo></BabylonDemo>
	</header>
</main>

<style>
	:global(html, body) {
		margin: 0;
		font-family:
			ui-sans-serif,
			system-ui,
			-apple-system,
			Segoe UI,
			Roboto,
			Arial,
			sans-serif;
		background: radial-gradient(1200px 600px at 20% 0%, #eef2ff 0%, #ffffff 55%);
		color: #0f172a;
	}

	.page {
		max-width: 860px;
		margin: 0 auto;
		padding: 48px 20px 64px;
		display: grid;
		gap: 18px;
	}

	.hero {
		padding: 22px;
		border: 1px solid #e2e8f0;
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(8px);
	}

	.badge {
		display: inline-block;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 6px 10px;
		border-radius: 999px;
		background: #ff3e0020;
		border: 1px solid #ff3e0030;
		color: #b42300;
	}

	h1 {
		margin: 12px 0 6px;
		font-size: 40px;
		line-height: 1.1;
	}

	.sub {
		margin: 0 0 14px;
		color: #334155;
	}

	code {
		background: #0f172a0d;
		padding: 2px 6px;
		border-radius: 6px;
	}
</style>

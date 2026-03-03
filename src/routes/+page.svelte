<!-- src/routes/+page.svelte -->
<script lang="ts">
	import BabylonDemo from '$lib/components/demo/BabylonDemo.svelte';
	import BabylonButton from '$lib/components/demo/BabylonButton.svelte';

	let name = 'world';
	let count = 0;

	let todos: string[] = ['Learn reactivity', 'Try bindings', 'Ship something'];
	let newTodo = '';

	$: greeting = `Hello, ${name}!`;

	function doThing() {
		console.log('3D button pressed');
	}

	function addTodo() {
		const text = newTodo.trim();
		if (!text) return;
		todos = [text, ...todos];
		newTodo = '';
	}

	function removeTodo(index: number) {
		todos = todos.filter((_, i) => i !== index);
	}
</script>

<svelte:head>
	<title>Svelte Basics</title>
</svelte:head>

<main class="page">
	<header class="hero">
		<span class="badge">Svelte</span>
		<h1>{greeting}</h1>
		<p class="sub">
			A tiny page showing: <code>$:</code> reactive statements, bindings, events, and templating.
		</p>

		<div class="row">
			<label class="field">
				<span>Your name</span>
				<input bind:value={name} placeholder="Type your name…" />
			</label>

			<button class="btn" on:click={() => (count += 1)}>
				Clicked <strong>{count}</strong> time{count === 1 ? '' : 's'}
			</button>
		</div>

		{#if count >= 5}
			<p class="hint">Nice—Svelte updates the DOM automatically when state changes.</p>
		{/if}

		<!--		<Button></Button>-->

		<BabylonDemo></BabylonDemo>

		<!--		<BabylonButton label="Do it" onPress={doThing} />-->
	</header>

	<section class="card">
		<div class="row bg-red-200 h-100 w-100"></div>
		<h2>Mini Todo (each / events / immutable updates)</h2>

		<form class="row" on:submit|preventDefault={addTodo}>
			<input
				class="grow"
				bind:value={newTodo}
				placeholder="Add a todo and press Enter…"
				aria-label="New todo"
			/>
			<button class="btn" type="submit">Add</button>
		</form>

		<ul class="list">
			{#each todos as todo, i (todo)}
				<li class="item">
					<span>{todo}</span>
					<button class="link" type="button" on:click={() => removeTodo(i)}>Remove</button>
				</li>
			{/each}
		</ul>

		<p class="meta">
			Items: <strong>{todos.length}</strong>
		</p>
	</section>
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

	.row {
		display: flex;
		gap: 10px;
		align-items: end;
		flex-wrap: wrap;
	}

	.field {
		display: grid;
		gap: 6px;
		min-width: 240px;
	}

	.field span {
		font-size: 12px;
		color: #475569;
	}

	input {
		padding: 10px 12px;
		border-radius: 12px;
		border: 1px solid #cbd5e1;
		outline: none;
		background: white;
	}

	input:focus {
		border-color: #6366f1;
		box-shadow: 0 0 0 4px #6366f120;
	}

	.btn {
		padding: 10px 14px;
		border-radius: 12px;
		border: 1px solid #0f172a;
		background: #0f172a;
		color: white;
		font-weight: 600;
		cursor: pointer;
	}

	.btn:hover {
		filter: brightness(1.05);
	}

	.hint {
		margin: 12px 0 0;
		color: #1d4ed8;
	}

	.card {
		padding: 18px 22px;
		border: 1px solid #e2e8f0;
		border-radius: 16px;
		background: white;
	}

	h2 {
		margin: 0 0 12px;
		font-size: 16px;
		color: #0f172a;
	}

	.grow {
		flex: 1;
		min-width: 240px;
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 14px 0 0;
		display: grid;
		gap: 8px;
	}

	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		background: #f8fafc;
	}

	.link {
		border: none;
		background: transparent;
		color: #b42300;
		cursor: pointer;
		font-weight: 600;
	}

	.meta {
		margin: 10px 0 0;
		color: #475569;
		font-size: 13px;
	}
</style>

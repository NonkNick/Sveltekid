<script lang="ts">
	import { Canvas } from '@threlte/core';
	import LavaLamp from '$lib/components/threlte/LavaLamp.svelte';

	const isDev = import.meta.env.MODE === 'development';
</script>

{#if isDev}
	<div class="studio-canvas">
		<Canvas>
			{#await import('@threlte/studio') then { Studio }}
				<Studio>
					<LavaLamp />
				</Studio>
			{/await}
		</Canvas>
	</div>
{:else}
	<p class="p-8 text-muted-foreground">Studio is dev-only.</p>
{/if}

<style>
    .studio-canvas {
        position: fixed;
        inset: 0;
        z-index: 100;
    }
</style>
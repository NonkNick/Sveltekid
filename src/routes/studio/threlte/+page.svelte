<script lang="ts">
	import { dev } from '$app/environment';
	import { Canvas } from '@threlte/core';
	import { Studio } from '@threlte/studio';
	import LavaLamp from '$lib/components/threlte/LavaLamp.svelte';
</script>

{#if dev}
	<div class="studio-canvas">
		<Canvas>
			<Studio>
				<LavaLamp />
			</Studio>
		</Canvas>
	</div>
{:else}
	<p class="p-8 text-muted-foreground">Studio is dev-only.</p>
{/if}

<style>
    .studio-canvas {
        position: fixed;
        inset: 0;
        /*z-index: 100;*/
    }
</style>
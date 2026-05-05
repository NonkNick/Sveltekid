<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import ThreeDemo from "$lib/components/demo/ThreeDemo.svelte";
    import {ui} from "$lib/stores/ui.svelte"

</script>

<div class="w-full  h-[200px] flex flex-col items-center justify-end overflow-hidden">

    {#if !ui.hidden}
    <Button onclick={() => ui.hidden = !ui.hidden} variant="positive" size="xl" class="w-[100px]">Play</Button>
    {/if}
    <ThreeDemo class="absolute inset-0 -z-10" />

</div>

<style>

</style>
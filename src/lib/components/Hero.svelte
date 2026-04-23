<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import ThreeDemo from "$lib/components/demo/ThreeDemo.svelte";
</script>

<div class="w-full bg-blue-300 h-[200px] flex flex-col items-center justify-center">
    <h1>Hero</h1>
    <p>This is the hero component</p>

    <Button variant="default" size="lg">Play</Button>
    <ThreeDemo class="absolute inset-0" />

</div>

<style>

</style>

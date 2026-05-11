<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import ThreeDemo from "$lib/components/demo/ThreeDemo.svelte";
    import {ui} from "$lib/stores/ui.svelte"
    import { onMount } from "svelte";
    import CanvasPortal from '$lib/components/CanvasPortal.svelte'
    import { T } from '@threlte/core'
    import { HTML } from '@threlte/extras'
    import { OrbitControls } from '@threlte/extras'




    // onMount(() => {
    //     import("$lib/game/main");
    // });
</script>

<div class="w-full  h-[200px] flex flex-col items-center justify-end overflow-hidden">

    {#if !ui.hidden}
    <Button onclick={() => ui.hidden = !ui.hidden} variant="positive" size="xl" class="w-[100px]">Play</Button>
    {/if}
<!--    <ThreeDemo class="absolute inset-0 -z-10" />-->

<!--    <script src="$lib/game/main.ts"></script>-->

<!--    <CanvasPortal>-->
<!--        <T.PerspectiveCamera-->
<!--                position.z={10}-->
<!--                makeDefault-->
<!--        />-->
<!--        <OrbitControls enableDamping />-->
<!--        <T.Mesh>-->
<!--            <T.BoxGeometry />-->
<!--            <T.MeshBasicMaterial color="red" />-->
<!--        </T.Mesh>-->
<!--        <HTML>-->
<!--        <h1>Hello, World!</h1>-->
<!--        </HTML>-->
<!--    </CanvasPortal>-->
</div>

<style>

</style>
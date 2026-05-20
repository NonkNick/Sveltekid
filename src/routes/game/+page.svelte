<script lang="ts">
    import CanvasPortal from '$lib/components/CanvasPortal.svelte'
    import { T } from '@threlte/core'
    import { HTML, OrbitControls } from '@threlte/extras'
    import {onMount} from "svelte";
    import GameComponent from "$lib/components/GameComponent.svelte";
    import VectorHailMary from "$lib/components/demo/VectorHailMary.svelte";

    let interacting = false

</script>

<main>
    <CanvasPortal>
<!--        <GameComponent></GameComponent>-->
<!--        <T.PerspectiveCamera position.z={10} makeDefault />-->
<!--        <OrbitControls enableDamping enabled={!interacting} />-->

<!--        <T.Mesh>-->
<!--            <T.BoxGeometry />-->
<!--            <T.MeshBasicMaterial color="red" />-->
<!--        </T.Mesh>-->
<!--        -->
        <VectorHailMary></VectorHailMary>
    </CanvasPortal>
</main>
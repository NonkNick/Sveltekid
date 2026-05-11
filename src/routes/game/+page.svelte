<script lang="ts">
    import CanvasPortal from '$lib/components/CanvasPortal.svelte'
    import { T } from '@threlte/core'
    import { HTML, OrbitControls } from '@threlte/extras'

    let interacting = false
</script>

<main>
    <CanvasPortal>
        <T.PerspectiveCamera position.z={10} makeDefault />
        <OrbitControls enableDamping enabled={!interacting} />

        <T.Mesh>
            <T.BoxGeometry />
            <T.MeshBasicMaterial color="red" />
        </T.Mesh>

        <HTML
                transform
                position={[0, 0, 0]}
                scale={0.5}
                pointerEvents="auto"
                occlude
        >
<!--        <div-->
<!--                style="width: 600px; height: 400px; background: white; border-radius: 8px; overflow: hidden;"-->
<!--                on:pointerenter={() => (interacting = true)}-->
<!--                on:pointerleave={() => (interacting = false)}-->
<!--        >-->
            <h1 style="margin: 0; padding: 12px;">Hello World</h1>
<!--            <iframe-->
<!--                    src="/"-->
<!--                    title="Profile"-->
<!--                    style="width: 100%; height: calc(100% - 56px); border: 0;"-->
<!--            />-->
<!--        </div>-->
        </HTML>
    </CanvasPortal>
</main>
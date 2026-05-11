<script lang="ts">
    import { T, useTask } from '@threlte/core'
    import { interactivity } from '@threlte/extras'
    import { OrbitControls, Stars, Grid } from '@threlte/extras'
    import { Spring } from 'svelte/motion'

    interactivity()

    const scale = new Spring(1)

    let rotation = $state(0)

    useTask((delta) => {
        rotation += delta
    })

    // hardcoded star settings
    const stars = {
        count: 5000,
        radius: 100,
        depth: 50,
        factor: 6,
        saturation: 1,
        lightness: 0.8,
        opacity: 1,
        fade: true,
        rounded: true,
        speed: 1
    }
</script>

<!-- Camera -->
<T.PerspectiveCamera
        makeDefault
        position={[2, 1, 5]}
        fov={50}
>
    <OrbitControls
            enableDamping
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.3}
    />
</T.PerspectiveCamera>

<!-- Stars -->
<Stars {...stars} />

<!-- Grid -->
<Grid
        infiniteGrid
        fadeOrigin={[0, 0, 0]}
        fadeDistance={10}
        cellColor="#dddddd"
        sectionColor="#dddddd"
/>

<!-- Your cube -->
<T.Mesh
        position={[3, 0, 0]}
        scale={0.5}
        rotation.y={rotation}
>
    <T.BoxGeometry args={[1, 2, 1]} />
    <T.MeshBasicMaterial color="red" />
</T.Mesh>
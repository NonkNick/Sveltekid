<script lang="ts">
    import { onMount } from "svelte";

    // WebGL (Engine): bundle default GLSL shader sources (prevents /src/Shaders/default.*.fx 404s)
    import "@babylonjs/core/Shaders/default.vertex";
    import "@babylonjs/core/Shaders/default.fragment";

    import { Engine } from "@babylonjs/core/Engines/engine.js";
    import { Scene } from "@babylonjs/core/scene.js";
    import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera.js";
    import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
    import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
    import { Color3, Color4 } from "@babylonjs/core/Maths/math.color.js";
    import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
    import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents.js";

    import "@babylonjs/core/Culling/ray.js";
    import "@babylonjs/core/Meshes/Builders/boxBuilder.js";
    import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.js";


    interface Props {
        label?: string;
        onPress?: () => void;
    }

    let { label = "Click", onPress }: Props = $props();

    let canvas: HTMLCanvasElement;

    onMount(() => {
        const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, alpha: true });

        const scene = new Scene(engine);
        // Transparent background so it blends with the page
        scene.clearColor = new Color4(0, 0, 0, 0);

        // Fixed camera, no controls (no zoom/pan/rotate)
        const camera = new FreeCamera("cam", new Vector3(0, 0, -4), scene);
        camera.setTarget(Vector3.Zero());
        // Don't attach controls — camera is static

        new HemisphericLight("light", new Vector3(0.3, 1, 0.2), scene);

        const btn = MeshBuilder.CreateBox("btn", { width: 2.4, height: 0.8, depth: 0.4 }, scene);
        btn.isPickable = true;
        btn.rotation.set(0.15, -0.25, 0);

        const mat = new StandardMaterial("btnMat", scene);
        mat.diffuseColor = new Color3(0.15, 0.15, 0.18);
        mat.specularColor = new Color3(0.3, 0.3, 0.3);
        btn.material = mat;

        const baseRot = { x: 0.15, y: -0.25 };
        let targetScale = 1;
        let hovering = false;
        let pressed = false;

        scene.onPointerObservable.add((info) => {
            const hit = info.pickInfo?.hit && info.pickInfo.pickedMesh === btn;

            if (info.type === PointerEventTypes.POINTERMOVE) {
                if (hit && !hovering) {
                    hovering = true;
                    mat.diffuseColor = new Color3(0.25, 0.25, 0.3);
                    mat.emissiveColor = new Color3(0.05, 0.05, 0.08);
                    targetScale = 1.06;
                } else if (!hit && hovering) {
                    hovering = false;
                    mat.diffuseColor = new Color3(0.15, 0.15, 0.18);
                    mat.emissiveColor = Color3.Black();
                    targetScale = pressed ? 0.96 : 1;
                }
            }

            if (info.type === PointerEventTypes.POINTERDOWN && hit) {
                pressed = true;
                mat.diffuseColor = new Color3(0.1, 0.1, 0.12);
                targetScale = 0.96;
            }

            if (info.type === PointerEventTypes.POINTERUP && pressed) {
                pressed = false;
                targetScale = hovering ? 1.06 : 1;
                mat.diffuseColor = hovering
                    ? new Color3(0.25, 0.25, 0.3)
                    : new Color3(0.15, 0.15, 0.18);

                if (hit) onPress?.();
            }
        });

        engine.runRenderLoop(() => {
            const s = btn.scaling;
            s.x += (targetScale - s.x) * 0.18;
            s.y += (targetScale - s.y) * 0.18;
            s.z += (targetScale - s.z) * 0.18;

            if (hovering && !pressed) {
                const t = performance.now() * 0.0015;
                btn.rotation.y = baseRot.y + Math.sin(t) * 0.08;
                btn.rotation.x = baseRot.x + Math.sin(t * 0.7) * 0.04;
            } else {
                btn.rotation.x += (baseRot.x - btn.rotation.x) * 0.12;
                btn.rotation.y += (baseRot.y - btn.rotation.y) * 0.12;
            }

            scene.render();
        });

        engine.resize();
        const onResize = () => engine.resize();
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            scene.dispose();
            engine.dispose();
        };
    });
</script>

<div class="wrapper">
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .wrapper {
        display: inline-block;
        width: 140px;
        height: 56px;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
    }
    canvas {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>
<script lang="ts">
    import { onMount } from "svelte";

    // WebGPU needs WGSL shader sources available. Without these, Babylon will try to fetch
    // /src/ShadersWGSL/default.*.fx at runtime (Vite dev server => 404).
    import "@babylonjs/core/ShadersWGSL/default.vertex";
    import "@babylonjs/core/ShadersWGSL/default.fragment";


    import { Scene } from "@babylonjs/core/scene.js";
    import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.js";
    import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
    import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
    import { Color3 } from "@babylonjs/core/Maths/math.color.js";

    import "@babylonjs/core/Meshes/Builders/groundBuilder.js";
    import "@babylonjs/core/Meshes/Builders/boxBuilder.js";
    import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.js";

    import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";

    import { createBabylonEngine } from "$lib/babylon/createEngine.js";

    let canvas: HTMLCanvasElement;
    let backend: "webgpu" | "webgl" | "initializing" = "initializing";
    let errorMessage: string | null = null;

    onMount(() => {
        let disposed = false;
        let cleanup: (() => void) | undefined;

        (async () => {
            try {
                const { engine, kind } = await createBabylonEngine(canvas);
                if (disposed) {
                    engine.dispose();
                    return;
                }

                backend = kind;

                const scene = new Scene(engine);
                scene.clearColor = new Color3(0.06, 0.07, 0.09).toColor4(1);

                const camera = new ArcRotateCamera(
                    "camera",
                    Math.PI / 2,
                    Math.PI / 2.6,
                    8,
                    new Vector3(0, 1, 0),
                    scene
                );
                camera.attachControl(canvas, true);

                // Make sure buffer matches CSS size (helps WebGPU show up reliably)
                engine.resize();
                requestAnimationFrame(() => engine.resize());

                new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);

                const ground = MeshBuilder.CreateGround("ground", { width: 12, height: 12 }, scene);
                const groundMat = new StandardMaterial("groundMat", scene);
                groundMat.diffuseColor = new Color3(0.2, 0.22, 0.26);
                groundMat.specularColor = new Color3(0.05, 0.05, 0.05);
                ground.material = groundMat;

                const box = MeshBuilder.CreateBox("box", { size: 1.5 }, scene);
                box.position = new Vector3(0, 1, 0);

                const boxMat = new StandardMaterial("boxMat", scene);
                boxMat.diffuseColor = new Color3(0.55, 0.72, 1.0);
                boxMat.specularColor = new Color3(0.9, 0.9, 0.9);
                box.material = boxMat;

                scene.onBeforeRenderObservable.add(() => {
                    box.rotation.y += 0.015;
                    box.rotation.x += 0.007;
                });

                engine.runRenderLoop(() => scene.render());

                const onResize = () => engine.resize();
                window.addEventListener("resize", onResize);

                cleanup = () => {
                    window.removeEventListener("resize", onResize);
                    scene.dispose();
                    engine.dispose();
                };
            } catch (err) {
                console.error("BabylonDemo failed:", err);
                errorMessage = err instanceof Error ? err.message : String(err);
            }
        })();

        return () => {
            disposed = true;
            cleanup?.();
        };
    });
</script>

<div style="position: relative; width: 100%; height: 360px; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
    <canvas bind:this={canvas} style="width: 100%; height: 100%; display: block;"></canvas>

    <div
            style="position: absolute; left: 12px; top: 12px; padding: 6px 10px; background: rgba(0,0,0,0.55); color: white; font: 12px/1.2 system-ui; border-radius: 10px;"
    >
        backend: {backend}
        {#if errorMessage}
            <div style="margin-top: 6px; max-width: 520px;">error: {errorMessage}</div>
        {/if}
    </div>
</div>
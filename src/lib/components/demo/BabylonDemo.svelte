<script lang="ts">
	import { onMount } from "svelte";

	import "@babylonjs/core/ShadersWGSL/default.vertex";
	import "@babylonjs/core/ShadersWGSL/default.fragment";
	import "@babylonjs/core/ShadersWGSL/particles.vertex";
	import "@babylonjs/core/ShadersWGSL/particles.fragment";

	import { Scene } from "@babylonjs/core/scene.js";
	import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.js";
	import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
	import { Color3, Color4 } from "@babylonjs/core/Maths/math.color.js";
	import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.js";
	import "@babylonjs/core/Meshes/Builders/sphereBuilder.js";
	import "@babylonjs/core/Meshes/Builders/boxBuilder.js";
	import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
	import { Texture } from "@babylonjs/core/Materials/Textures/texture.js";
	import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem.js";
	import { SphereParticleEmitter } from "@babylonjs/core/Particles/EmitterTypes/sphereParticleEmitter.js";
	import { createBabylonEngine } from "$lib/babylon/createEngine.js";

	let canvas: HTMLCanvasElement;

	onMount(() => {
		let disposed = false;
		let cleanup: (() => void) | undefined;

		const scheduleInit = (cb: () => void) =>
			"requestIdleCallback" in window
				? (window as any).requestIdleCallback(cb, { timeout: 2000 })
				: setTimeout(cb, 200);

		scheduleInit(() => {
			(async () => {
				if (disposed) return;

				try {
					const { engine } = await createBabylonEngine(canvas);
					if (disposed) {
						engine.dispose();
						return;
					}

					engine.setHardwareScalingLevel(1 / 0.75);
					engine.setSize(canvas.clientWidth, canvas.clientHeight);

					const scene = new Scene(engine);
					scene.clearColor = new Color4(0, 0, 0, 1);
					scene.skipPointerMovePicking = true;
					scene.pointerMovePredicate = () => false;

					const stars = MeshBuilder.CreateBox("emitter", { size: 0.01 }, scene);
					stars.isPickable = false;

					const surfaceParticles = new ParticleSystem("surfaceParticles", 1600, scene);
					const flareParticles = new ParticleSystem("flareParticles", 20, scene);
					const coronaParticles = new ParticleSystem("coronaParticles", 600, scene);
					const starsParticles = new ParticleSystem("starsParticles", 500, scene);

					const base = "https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun";
					surfaceParticles.particleTexture = new Texture(`${base}/T_SunSurface.png`, scene);
					flareParticles.particleTexture = new Texture(`${base}/T_SunFlare.png`, scene);
					coronaParticles.particleTexture = new Texture(`${base}/T_Star.png`, scene);
					starsParticles.particleTexture = new Texture(`${base}/T_Star.png`, scene);

					const coreSphere = MeshBuilder.CreateSphere("coreSphere", { diameter: 2.01, segments: 64 }, scene);
					coreSphere.isPickable = false;
					const coreMat = new StandardMaterial("coreMat", scene);
					coreMat.emissiveColor = new Color3(0.3773, 0.093, 0.0266);
					coreSphere.material = coreMat;

					for (const ps of [surfaceParticles, flareParticles, coronaParticles]) {
						ps.preWarmStepOffset = 10;
						ps.preWarmCycles = 100;
						ps.minInitialRotation = -2 * Math.PI;
						ps.maxInitialRotation = 2 * Math.PI;
					}

					const sunEmitter = new SphereParticleEmitter();
					sunEmitter.radius = 1;
					sunEmitter.radiusRange = 0;

					const starsEmitter = new SphereParticleEmitter();
					starsEmitter.radius = 20;
					starsEmitter.radiusRange = 0;

					surfaceParticles.emitter = coreSphere;
					surfaceParticles.particleEmitterType = sunEmitter;
					flareParticles.emitter = coreSphere;
					flareParticles.particleEmitterType = sunEmitter;
					coronaParticles.emitter = coreSphere;
					coronaParticles.particleEmitterType = sunEmitter;
					starsParticles.emitter = stars;
					starsParticles.particleEmitterType = starsEmitter;

					starsParticles.color1 = new Color4(0.898, 0.737, 0.718, 1.0);
					starsParticles.color2 = new Color4(0.584, 0.831, 0.894, 1.0);

					surfaceParticles.addColorGradient(0, new Color4(0.8509, 0.4784, 0.1019, 0.0));
					surfaceParticles.addColorGradient(0.4, new Color4(0.6259, 0.3056, 0.0619, 0.5));
					surfaceParticles.addColorGradient(0.5, new Color4(0.6039, 0.2887, 0.0579, 0.5));
					surfaceParticles.addColorGradient(1.0, new Color4(0.3207, 0.0713, 0.0075, 0.0));

					flareParticles.addColorGradient(0, new Color4(1, 0.9612, 0.5141, 0.0));
					flareParticles.addColorGradient(0.25, new Color4(0.9058, 0.7152, 0.3825, 1.0));
					flareParticles.addColorGradient(1.0, new Color4(0.632, 0.0, 0.0, 0.0));

					coronaParticles.addColorGradient(0, new Color4(0.8509, 0.4784, 0.1019, 0.0));
					coronaParticles.addColorGradient(0.5, new Color4(0.6039, 0.2887, 0.0579, 0.12));
					coronaParticles.addColorGradient(1.0, new Color4(0.3207, 0.0713, 0.0075, 0.0));

					surfaceParticles.minSize = 0.4;
					surfaceParticles.maxSize = 0.7;

					flareParticles.minScaleX = 0.5;
					flareParticles.minScaleY = 0.5;
					flareParticles.maxScaleX = 1.0;
					flareParticles.maxScaleY = 1.0;
					flareParticles.addSizeGradient(0, 0);
					flareParticles.addSizeGradient(1, 1);

					coronaParticles.minScaleX = 0.5;
					coronaParticles.minScaleY = 0.75;
					coronaParticles.maxScaleX = 1.2;
					coronaParticles.maxScaleY = 3.0;

					starsParticles.minSize = 0.15;
					starsParticles.maxSize = 0.3;

					surfaceParticles.minLifeTime = 8;
					surfaceParticles.maxLifeTime = 8;
					flareParticles.minLifeTime = 10;
					flareParticles.maxLifeTime = 10;
					coronaParticles.minLifeTime = 2;
					coronaParticles.maxLifeTime = 2;
					starsParticles.minLifeTime = 999999;
					starsParticles.maxLifeTime = 999999;

					surfaceParticles.emitRate = 200;
					flareParticles.emitRate = 1;
					coronaParticles.emitRate = 300;
					starsParticles.manualEmitCount = 500;
					starsParticles.maxEmitPower = 0;

					surfaceParticles.blendMode = ParticleSystem.BLENDMODE_ADD;
					flareParticles.blendMode = ParticleSystem.BLENDMODE_ADD;
					coronaParticles.blendMode = ParticleSystem.BLENDMODE_ADD;
					starsParticles.blendMode = ParticleSystem.BLENDMODE_STANDARD;

					const zero = Vector3.Zero();
					surfaceParticles.gravity = zero.clone();
					flareParticles.gravity = zero.clone();
					coronaParticles.gravity = zero.clone();
					starsParticles.gravity = zero.clone();

					surfaceParticles.minAngularSpeed = -0.4;
					surfaceParticles.maxAngularSpeed = 0.4;
					flareParticles.minAngularSpeed = 0;
					flareParticles.maxAngularSpeed = 0;
					coronaParticles.minAngularSpeed = 0;
					coronaParticles.maxAngularSpeed = 0;
					starsParticles.minAngularSpeed = 0;
					starsParticles.maxAngularSpeed = 0;

					surfaceParticles.minEmitPower = 0;
					surfaceParticles.maxEmitPower = 0;
					surfaceParticles.updateSpeed = 0.005;
					flareParticles.minEmitPower = 0.001;
					flareParticles.maxEmitPower = 0.01;
					coronaParticles.minEmitPower = 0;
					coronaParticles.maxEmitPower = 0;
					starsParticles.minEmitPower = 0;

					surfaceParticles.isBillboardBased = false;
					flareParticles.isBillboardBased = true;
					coronaParticles.isBillboardBased = true;
					starsParticles.isBillboardBased = true;

					starsParticles.renderingGroupId = 0;
					coronaParticles.renderingGroupId = 1;
					flareParticles.renderingGroupId = 2;
					surfaceParticles.renderingGroupId = 3;
					coreSphere.renderingGroupId = 3;

					surfaceParticles.start();
					flareParticles.start();
					coronaParticles.start();
					starsParticles.start();

					const camera = new ArcRotateCamera(
						"camera",
						-Math.PI / 2,
						Math.PI / 2,
						3, // ← smaller radius = sun fills more of the screen
						new Vector3(3, 0, 0), // ← larger X = camera aims further right = sun sits further left
						scene
					);
					camera.lowerRadiusLimit = 2;

					// ── Scroll → spin on own axis ────────────────────────────────────
					// Uses the scroll event (fires after the page has actually moved)
					// rather than wheel (fires before). We diff scrollY each call so
					// fast flings give a bigger impulse than slow drags.
					const BASE_SPIN = 0.002;
					let spinVelocity = BASE_SPIN;
					let lastScrollY = window.scrollY;

					const onScroll = () => {
						const delta = window.scrollY - lastScrollY;
						lastScrollY = window.scrollY;
						spinVelocity += delta * 0.0003;
						spinVelocity = Math.max(-0.04, Math.min(0.04, spinVelocity));
					};
					window.addEventListener("scroll", onScroll, { passive: true });

					scene.onBeforeRenderObservable.add(() => {
						coreSphere.rotation.y += spinVelocity;
						// Spring back to idle — ~1 s decay at 30 fps
						spinVelocity += (BASE_SPIN - spinVelocity) * 0.025;
					});

					// ── Page Visibility API: pause GPU work when tab is hidden ───────
					// Free wins — zero cost when the user switches tabs.
					const onVisibilityChange = () => {
						if (document.hidden) {
							engine.stopRenderLoop();
						} else {
							lastScrollY = window.scrollY; // re-sync so we don't get a jump
							startRenderLoop();
						}
					};
					document.addEventListener("visibilitychange", onVisibilityChange);

					// ── 30 fps cap render loop ───────────────────────────────────────
					let lastTime = 0;
					const FRAME_MS = 1000 / 30;

					const startRenderLoop = () => {
						engine.runRenderLoop(() => {
							const now = performance.now();
							if (now - lastTime >= FRAME_MS) {
								lastTime = now;
								scene.render();
							}
						});
					};

					engine.resize();
					requestAnimationFrame(() => engine.resize());
					startRenderLoop();

					const onResize = () => engine.resize();
					window.addEventListener("resize", onResize);

					cleanup = () => {
						window.removeEventListener("scroll", onScroll);
						window.removeEventListener("resize", onResize);
						document.removeEventListener("visibilitychange", onVisibilityChange);
						engine.stopRenderLoop();
						scene.dispose();
						engine.dispose();
					};
				} catch (err) {
					console.error("BabylonDemo failed:", err);
				}
			})();
		});

		return () => {
			disposed = true;
			cleanup?.();
		};
	});
</script>

<canvas
	bind:this={canvas}
	style="position: fixed; inset: 0; width: 100vw; height: 100vh; display: block; z-index: -1; pointer-events: none;"
></canvas>

import type { AbstractEngine } from '@babylonjs/core/Engines/abstractEngine.js';
import { Engine } from '@babylonjs/core/Engines/engine.js';
import { WebGPUEngine } from '@babylonjs/core/Engines/webgpuEngine.js';

export type BabylonEngineKind = 'webgpu' | 'webgl';

export async function createBabylonEngine(
	canvas: HTMLCanvasElement
): Promise<{ engine: AbstractEngine; kind: BabylonEngineKind }> {
	const webgpuAvailable = typeof navigator !== 'undefined' && 'gpu' in navigator;

	if (webgpuAvailable) {
		const webgpu = new WebGPUEngine(canvas);
		await webgpu.initAsync();
		return { engine: webgpu, kind: 'webgpu' };
	}

	const webgl = new Engine(canvas, true);
	return { engine: webgl, kind: 'webgl' };
}

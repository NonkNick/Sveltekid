# Svelte 5 Pointer Events Cheatsheet (Proper Way)

## Basic Pointer Events on Element

```svelte
<script>
	function handlePointerDown(e) {
		console.log('Start:', e.clientX, e.clientY);
	}

	function handlePointerMove(e) {
		console.log('Moving:', e.clientX, e.clientY);
	}

	function handlePointerUp(e) {
		console.log('End:', e.clientX, e.clientY);
	}
</script>

<div 
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
>
	Pointer me
</div>
```

## Global Pointer Events with svelte:window

```svelte
<script>
	let x = $state(0);
	let y = $state(0);

	function handlePointerMove(e) {
		x = e.clientX;
		y = e.clientY;
	}

	function handlePointerUp(e) {
		console.log('Released at:', x, y);
	}
</script>

<svelte:window
	on:pointermove={handlePointerMove}
	on:pointerup={handlePointerUp}
/>

<p>Pointer at: {x}, {y}</p>
```

## Drag Delta with svelte:window

```svelte
<script>
	let isDragging = $state(false);
	let startX = $state(0);
	let startY = $state(0);
	let currentX = $state(0);
	let currentY = $state(0);

	function handlePointerDown(e) {
		isDragging = true;
		startX = e.clientX;
		startY = e.clientY;
	}

	function handlePointerMove(e) {
		if (!isDragging) return;
		currentX = e.clientX;
		currentY = e.clientY;
	}

	function handlePointerUp() {
		isDragging = false;
	}

	$derived.by(() => {
		if (!isDragging) return { x: 0, y: 0 };
		return {
			x: currentX - startX,
			y: currentY - startY
		};
	});
</script>

<svelte:window
	on:pointermove={handlePointerMove}
	on:pointerup={handlePointerUp}
/>

<div onpointerdown={handlePointerDown}>
	Drag me
</div>
```

## Drag with Spring Animation

```svelte
<script>
	import { spring } from 'svelte/motion';

	let isDragging = $state(false);
	let startY = $state(0);
	let currentY = $state(0);
	let y = spring(0, { stiffness: 0.15, damping: 0.9 });

	function handlePointerDown(e) {
		isDragging = true;
		startY = e.clientY;
	}

	function handlePointerMove(e) {
		if (!isDragging) return;
		currentY = e.clientY;
		const delta = currentY - startY;
		y.set(delta, { hard: true });
	}

	function handlePointerUp() {
		isDragging = false;
		y.set(0);
	}
</script>

<svelte:window
	on:pointermove={handlePointerMove}
	on:pointerup={handlePointerUp}
/>

<div 
	style="transform: translateY({$y}px)"
	onpointerdown={handlePointerDown}
>
	Drag me (springs back)
</div>

<style>
	div {
		will-change: transform;
	}
</style>
```

## Drag with Threshold

```svelte
<script>
	import { spring } from 'svelte/motion';

	const THRESHOLD = 100;

	let isDragging = $state(false);
	let startY = $state(0);
	let currentY = $state(0);
	let y = spring(0, { stiffness: 0.15, damping: 0.9 });

	function handlePointerDown(e) {
		isDragging = true;
		startY = e.clientY;
	}

	function handlePointerMove(e) {
		if (!isDragging) return;
		currentY = e.clientY;
		const delta = currentY - startY;
		if (delta > 0) {
			y.set(delta, { hard: true });
		}
	}

	function handlePointerUp() {
		isDragging = false;
		const delta = currentY - startY;

		if (delta > THRESHOLD) {
			// Trigger action (dismiss, expand, etc.)
			console.log('Threshold crossed!');
		}

		y.set(0);
	}
</script>

<svelte:window
	on:pointermove={handlePointerMove}
	on:pointerup={handlePointerUp}
/>

<div 
	style="transform: translateY({$y}px)"
	onpointerdown={handlePointerDown}
>
	Drag down to dismiss
</div>

<style>
	div {
		will-change: transform;
	}
</style>
```

## Velocity Tracking

```svelte
<script>
	let lastY = $state(0);
	let lastTime = $state(0);
	let velocity = $state(0);

	function handlePointerDown(e) {
		lastY = e.clientY;
		lastTime = Date.now();
	}

	function handlePointerMove(e) {
		const now = Date.now();
		const deltaY = e.clientY - lastY;
		const deltaTime = now - lastTime;

		if (deltaTime > 0) {
			velocity = deltaY / deltaTime;
		}

		lastY = e.clientY;
		lastTime = now;
	}

	function handlePointerUp() {
		console.log('Final velocity:', velocity);
		// Use velocity for momentum animations
	}
</script>

<svelte:window
	on:pointermove={handlePointerMove}
	on:pointerup={handlePointerUp}
/>

<div onpointerdown={handlePointerDown}>
	Drag to measure velocity
</div>
```

## Swipe Detection

```svelte
<script>
	let startX = $state(0);
	let startY = $state(0);

	function handlePointerDown(e) {
		startX = e.clientX;
		startY = e.clientY;
	}

	function handlePointerUp(e) {
		const deltaX = e.clientX - startX;
		const deltaY = e.clientY - startY;
		const distance = Math.hypot(deltaX, deltaY);

		if (distance < 10) return; // Too small, ignore

		const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

		if (Math.abs(angle) < 45) {
			console.log('Swiped right');
		} else if (Math.abs(angle) > 135) {
			console.log('Swiped left');
		} else if (angle > 45 && angle < 135) {
			console.log('Swiped down');
		} else {
			console.log('Swiped up');
		}
	}
</script>

<svelte:window on:pointerup={handlePointerUp} />

<div onpointerdown={handlePointerDown}>
	Swipe me
</div>
```

## Pointer Type Detection

```svelte
<script>
	function handlePointerDown(e) {
		console.log('Pointer type:', e.pointerType); // 'touch', 'mouse', 'pen'
		console.log('Pointer ID:', e.pointerId);
		console.log('Pressure:', e.pressure); // 0-1 for touch
	}
</script>

<div onpointerdown={handlePointerDown}>
	Check console for pointer type
</div>
```

## Multi-pointer Tracking

```svelte
<script>
	let pointers = $state(new Map());

	function handlePointerDown(e) {
		pointers.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY,
			type: e.pointerType
		});
	}

	function handlePointerMove(e) {
		if (pointers.has(e.pointerId)) {
			pointers.set(e.pointerId, {
				x: e.clientX,
				y: e.clientY,
				type: e.pointerType
			});
		}
	}

	function handlePointerUp(e) {
		pointers.delete(e.pointerId);
	}

	function handlePointerCancel(e) {
		pointers.delete(e.pointerId);
	}
</script>

<svelte:window
	on:pointermove={handlePointerMove}
	on:pointerup={handlePointerUp}
	on:pointercancel={handlePointerCancel}
/>

<div onpointerdown={handlePointerDown}>
	Multi-touch area
</div>

<p>Active pointers: {pointers.size}</p>
```

## Pinch Zoom

```svelte
<script>
	let pointers = $state(new Map());
	let scale = $state(1);
	let initialDistance = 0;
	let currentDistance = 0;

	function handlePointerDown(e) {
		pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

		if (pointers.size === 2) {
			const [p1, p2] = Array.from(pointers.values());
			initialDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
		}
	}

	function handlePointerMove(e) {
		pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

		if (pointers.size === 2) {
			const [p1, p2] = Array.from(pointers.values());
			currentDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
			scale = currentDistance / initialDistance;
		}
	}

	function handlePointerUp(e) {
		pointers.delete(e.pointerId);
		if (pointers.size < 2) scale = 1;
	}
</script>

<svelte:window
	on:pointermove={handlePointerMove}
	on:pointerup={handlePointerUp}
/>

<div 
	style="transform: scale({scale})"
	onpointerdown={handlePointerDown}
>
	Pinch to zoom
</div>

<style>
	div {
		will-change: transform;
	}
</style>
```

## Prevent Default Behavior

```svelte
<script>
	function handlePointerDown(e) {
		e.preventDefault(); // Disable default touch actions
	}
</script>

<div 
	onpointerdown={handlePointerDown}
	style="touch-action: none;"
>
	No scroll on this element
</div>
```

## Event Properties Reference

| Property | Type | Description |
|----------|------|-------------|
| `clientX` / `clientY` | number | Position in viewport |
| `pageX` / `pageY` | number | Position in document |
| `screenX` / `screenY` | number | Position on screen |
| `pointerType` | string | 'touch' \| 'mouse' \| 'pen' |
| `pointerId` | number | Unique ID for pointer |
| `pressure` | number | Force (0-1, 0.5 for mouse) |
| `width` / `height` | number | Contact area (touch) |
| `isPrimary` | boolean | Is this the primary pointer? |

## CSS Performance Tips

```css
.draggable {
	will-change: transform;
	touch-action: none;
	user-select: none;
}
```

---

**Key Rule:** Use `svelte:window` for global pointer events. No `document.addEventListener` bullshit.
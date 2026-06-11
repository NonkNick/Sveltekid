# Pointer Events in Svelte 5 — Cheatsheet

Origin labels used throughout:
- **[lang]** language feature — JS/TS/DOM/CSS spec or Svelte syntax itself
- **[fw]** framework convention — names hardcoded in Svelte/Threlte source
- **[mine]** a name you chose — could be anything
- **[runtime]** runtime-supplied — value the browser/framework hands your callback

---

## 1. Mental model

Pointer events **[lang]** are the DOM's unified input model: one event family for mouse, touch, and pen. Every event is a `PointerEvent` (extends `MouseEvent`) carrying a `pointerId` that identifies *which* finger/pen/mouse fired it. Svelte 5 adds nothing on top — `onpointerdown={fn}` is just the wiring; the semantics are pure DOM spec. Write pointer events for **gestures** (drag, draw, pinch); keep `onclick` for **activation** (it also fires from keyboard Enter/Space — pointer events never do).

---

## 2. The event family

| Event **[lang]** | Bubbles | Fires when | Typical use |
|---|---|---|---|
| `pointerdown` | yes | button pressed / finger touches / pen contacts | start gesture, `setPointerCapture` |
| `pointermove` | yes | pointer moves (throttled to display refresh) | drag, draw, pan |
| `pointerup` | yes | release | end gesture |
| `pointercancel` | yes | **browser aborts the gesture** (scroll took over, OS gesture, palm rejection) | end gesture — always pair with `pointerup` |
| `pointerenter` / `pointerleave` | **no** | pointer crosses element boundary (no re-fire on children) | hover state |
| `pointerover` / `pointerout` | yes | boundary crossing, re-fires per child | rarely; delegated hover |
| `gotpointercapture` / `lostpointercapture` | yes | capture acquired / released | sync UI with capture state |
| `pointerrawupdate` | yes | unthrottled moves (Chromium; not throttled to rAF) | low-latency drawing; wire manually, see §11 |

`contextmenu` **[lang]** still fires separately on right-click / long-press; `preventDefault()` it inside `pointerdown` won't stop it — handle `oncontextmenu` itself.

---

## 3. `PointerEvent` anatomy

All **[runtime]** — the browser fills these in on the event object passed to your handler:

| Property | Meaning |
|---|---|
| `pointerId` | stable ID for this contact for its whole down→up lifetime; key for multi-touch maps |
| `pointerType` | `"mouse" \| "pen" \| "touch"` |
| `isPrimary` | `true` for the first/only contact (the one that also synthesizes mouse events) |
| `clientX/Y` | viewport coordinates — **prefer these for deltas** (see pitfall §13) |
| `movementX/Y` | delta since last event; convenient but inconsistent for touch across browsers/DPI |
| `offsetX/Y` | relative to target's padding box |
| `pressure` | 0–1 (0.5 default for mouse button down) |
| `tiltX/Y`, `twist` | pen orientation |
| `buttons` | bitmask while moving: `1` left/touch, `2` right, `4` middle — `if (e.buttons & 1)` = "moving while held" without your own flag |
| `button` | which button changed, on `pointerdown`/`up` only (`0` left, `2` right) |
| `width/height` | contact geometry (finger size) |

---

## 4. Svelte 5 wiring

```svelte
<div onpointerdown={fn} />          <!-- [lang] event attribute, Svelte 5; fn is [mine] -->
<div {onpointerdown} />             <!-- [lang] shorthand: function named exactly `onpointerdown` -->
<div onpointerdowncapture={fn} />   <!-- [lang] capture-phase: suffix `capture` -->
```

- `onpointerdown` **[lang]** is a plain attribute/prop. Svelte compiles it: most bubbling pointer events are **delegated** (one real listener at the app root dispatches to your handler); non-bubbling ones (`pointerenter`/`leave`) get a direct `addEventListener` on the element. Your handler always receives the **native** `PointerEvent` **[runtime]** — nothing wrapped.
- **Name handlers after the attribute.** `{onpointerdown}` is the generic attribute shorthand `x={x}` **[lang]** — it reaches event handlers only because Svelte 5 made them ordinary attributes (Svelte 4's `on:` was a directive with no shorthand; bare `on:click` meant event *forwarding*, a removed mechanism). Limit: one function can't shorthand two attributes, so a shared up/cancel handler is shorthand once, longhand once: `{onpointerup} onpointercancel={onpointerup}`. The convention buys nothing at `on()`/`{@attach}` call sites — those names never meet an attribute.
- **Svelte 4 modifiers are gone.** Replacements:
    - `|preventDefault`, `|stopPropagation`, `|once`, `|self` → write the JS inline: `onpointerdown={(e) => { e.preventDefault(); start(e) }}`.
    - `|passive` / listener options → no attribute form; use `on()` or an attachment (below).
- Mixing manual listeners with Svelte handlers? Use `on` **[fw]** from `svelte/events` instead of raw `addEventListener` — it preserves correct ordering relative to Svelte's delegated handlers and returns a cleanup function:

```ts
import { on } from "svelte/events"; // [fw]
const off = on(node, "pointermove", handler, { passive: true }); // [lang] options
off(); // remove
```

- **Attachments** **[lang]** (`{@attach …}`, Svelte 5.29+) are the idiomatic spot for listeners that need options:

```svelte
<div {@attach (node) => on(node, "pointermove", draw, { passive: true })} />
<!-- node is [runtime]; returned cleanup runs on detach -->
```

- TypeScript: inline handlers get `currentTarget` narrowed automatically. For named functions, type them with `PointerEventHandler` **[fw]** from `svelte/elements`:

```ts
import type { PointerEventHandler } from "svelte/elements";
const onpointerdown: PointerEventHandler<HTMLDivElement> = (e) => {
  e.currentTarget.setPointerCapture(e.pointerId); // currentTarget: HTMLDivElement
};
// template: <div {onpointerdown}></div>
```

---

## 5. Where to attach — decision tree

1. **Hover / press feedback on one element** → handlers on the element. Done.
2. **Drag / slider / resize that starts on an element you own** → element handlers + `setPointerCapture` (§6). The capture keeps events flowing to the element even outside its bounds, so you never need window listeners.
3. **No owning element** (canvas-wide pan, app-global gesture, gesture started in code you don't control) → `<svelte:window onpointermove={…} onpointerup={…} />` **[lang]** — Svelte adds the listener on mount, removes on destroy.
4. **`document`-owned events only** (`pointerlockchange` lives on `document`) → `<svelte:document onpointerlockchange={…} />` **[lang]**. Pointer *movement* never fires on `document` exclusively — don't reach for this for move/up.
5. **Need `passive`, `signal`, conditional attachment, or a dynamic target** → `$effect` **[lang]** + `on()`:

```ts
$effect(() => {
  if (!enabled) return;                              // [mine] reactive condition
  return on(window, "pointermove", pan, { passive: true }); // cleanup returned
});
```

---

## 6. The canonical drag (memorize this one)

```svelte
<script lang="ts">
  import type { PointerEventHandler } from "svelte/elements"; // [fw]

  let pos = $state({ x: 0, y: 0 });   // [lang] $state rune; pos is [mine]
  let dragging = $state(false);

  // [mine] — but named after the attributes, so {shorthand} applies below
  const onpointerdown: PointerEventHandler<HTMLDivElement> = (e) => { // e is [runtime]
    dragging = true;
    // [lang] route ALL further events for this pointerId to this element,
    // even when the pointer leaves its bounds:
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onpointermove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    pos.x += e.movementX;              // see §13 for the clientX alternative
    pos.y += e.movementY;
  };
  function onpointerup() {
    dragging = false;
    // capture auto-releases on pointerup/pointercancel — no manual release needed
  }
</script>

<div
  class="touch-none select-none"
  style="translate: {pos.x}px {pos.y}px"
  {onpointerdown}
  {onpointermove}
  {onpointerup}
  onpointercancel={onpointerup}
></div>
```

Three load-bearing details:

1. **`touch-action: none`** (Tailwind `touch-none` **[fw]**) — without it, touch movement is interpreted as scroll and the browser fires `pointercancel` after a few pixels. The #1 "works on desktop, dies on mobile" bug.
2. **`pointercancel` handled identically to `pointerup`** — otherwise `dragging` sticks `true` when the browser aborts.
3. **`setPointerCapture` in `pointerdown`** — mouse gets no implicit capture; this normalizes mouse to match touch (which *is* implicitly captured, §7).
4. **Handler names = attribute names** → the `{onpointerdown}` shorthand. `pointercancel` reuses the same function via longhand, since one name can't shorthand two attributes.

---

## 7. Pointer capture, precisely

All **[lang]**, methods on `Element`:

- `el.setPointerCapture(pointerId)` — from now until release, every event for that `pointerId` retargets to `el`, regardless of what's under the pointer. Other elements' `pointerover/out/enter/leave` are suppressed meanwhile.
- Release: **implicit** on `pointerup`/`pointercancel`, or explicit via `el.releasePointerCapture(pointerId)`.
- `el.hasPointerCapture(pointerId)` — query.
- `gotpointercapture` / `lostpointercapture` fire on the element when capture starts/ends — useful to toggle a "grabbing" cursor without your own flag.
- **Spec quirk:** direct-manipulation pointers (touch) get *implicit* capture to the `pointerdown` target. Mouse doesn't. Explicit `setPointerCapture` makes both behave the same — call it always.
- Must be called while the pointer is active (typically inside `pointerdown`); throws `NotFoundError` for a dead `pointerId`.

---

## 8. `touch-action` reference

CSS **[lang]**, set on the element receiving `pointerdown`. Tells the browser which gestures *it* may keep — anything kept can `pointercancel` you.

| Value | Browser keeps | Use for |
|---|---|---|
| `auto` (default) | everything (scroll, zoom) | non-gesture UI |
| `none` | nothing — you get every move | full drag/draw surfaces |
| `pan-y` | vertical scroll only | horizontal carousel/slider (you handle X, browser keeps Y scroll) |
| `pan-x` | horizontal scroll only | vertical drag inside a horizontal scroller |
| `manipulation` | pan + pinch, **drops double-tap-to-zoom delay** | buttons/links you want snappy taps on |

Tailwind: `touch-none`, `touch-pan-y`, `touch-pan-x`, `touch-manipulation` **[fw]**.

---

## 9. `pointercancel` — when the browser bails

Fires when the browser decides the gesture is its own: a permitted `touch-action` scroll/zoom started, an OS edge/back gesture, palm rejection, device rotation, the tab losing the pointer. After it, **no `pointerup` comes** for that `pointerId`. Rules:

- Same cleanup path as `pointerup`, always.
- Capture is implicitly released.
- If you get cancels during what should be a drag → your `touch-action` is too permissive.

---

## 10. Multi-pointer (pinch) skeleton

Track contacts by `pointerId` in a `Map`; `isPrimary` distinguishes the first finger.

```svelte
<script lang="ts">
  import type { PointerEventHandler } from "svelte/elements";

  const pts = new Map<number, { x: number; y: number }>(); // [mine] live contacts
  let scale = $state(1);
  let lastDist = 0;

  const onpointerdown: PointerEventHandler<HTMLDivElement> = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };
  function onpointermove(e: PointerEvent) {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (lastDist) scale *= dist / lastDist;
      lastDist = dist;
    }
  }
  function onpointerup(e: PointerEvent) {
    pts.delete(e.pointerId);
    if (pts.size < 2) lastDist = 0;
  }
</script>

<div class="touch-none" {onpointerdown} {onpointermove} {onpointerup} onpointercancel={onpointerup}></div>
```

The `Map` is deliberately **not** `$state` — it drives math, not markup; only `scale` needs reactivity.

---

## 11. High-frequency input (drawing apps)

`pointermove` is coalesced: the browser batches raw samples and delivers ~1 event per frame. To recover the batch:

- `e.getCoalescedEvents()` **[lang]** → array of the raw `PointerEvent`s folded into this one. Iterate these for smooth ink strokes instead of connecting frame-rate-spaced points.
- `e.getPredictedEvents()` → browser's extrapolated future points (latency hiding).
- `pointerrawupdate` → unthrottled stream; has no Svelte attribute typing — wire via `on(node, "pointerrawupdate" as any, fn)` inside `{@attach}` / `$effect`. Chromium-only; feature-detect.

---

## 12. Compatibility mouse events & `click`

After pointer events from the **primary** pointer, the browser synthesizes legacy events in order: `pointerdown → mousedown → pointermove → mousemove → pointerup → mouseup → click`. Consequences:

- `e.preventDefault()` inside `pointerdown` suppresses the synthesized mouse events **and** default actions (focus, text-selection start) — but not `click` and not `contextmenu`.
- Never mix `mousedown` and `pointerdown` handlers for the same gesture — you'll run twice on mouse input.
- Keep `onclick` for buttons/links: it's the only one keyboard users trigger.

---

## 13. Pitfall checklist

- [ ] `touch-action` set on the gesture surface (§8) — else mobile `pointercancel`.
- [ ] `pointercancel` handled = `pointerup`.
- [ ] `setPointerCapture` in `pointerdown` — else mouse drags die at the element edge.
- [ ] `user-select: none` (Tailwind `select-none`) on drag surfaces, or `preventDefault()` in `pointerdown` — else text selection fights the drag.
- [ ] Deltas: `movementX/Y` is unreliable for touch on some browsers/DPI — robust version stores last `clientX/Y` per `pointerId` and subtracts.
- [ ] Multi-touch state keyed by `pointerId`, cleared on up **and** cancel — leaked entries = ghost fingers.
- [ ] Hover-only affordances gated by capability, not pointer type: `window.matchMedia("(hover: hover)")` **[lang]**.
- [ ] Don't `$state` high-frequency scratch data (last positions, the contacts `Map`) — only what the template reads.

---

## 14. Threlte (3D) — same names, different dispatcher

Inside `<Canvas>` **[fw]** you don't attach DOM handlers to meshes. `interactivity()` **[fw]**, from `@threlte/extras`, called once in a component under `<Canvas>`, attaches DOM pointer listeners to the canvas wrapper, raycasts each event into the scene, and re-dispatches to hit objects:

```svelte
<script lang="ts">
  import { interactivity } from "@threlte/extras";
  interactivity(); // [fw] sets up the raycasting dispatcher
</script>

<T.Mesh
  onpointerenter={() => (hovered = true)}
  onpointermove={(e) => console.log(e.point)}
  {onclick}  <!-- shorthand works on component props too: function named `onclick` -->
/>
```

The handler arg **[runtime]** is the raycast intersection enriched with the DOM event — expect `point` (`Vector3` hit position), `object`, `distance`, plus the native event and a `stopPropagation()` that stops propagation through the *hit list* (nearer objects first), not the DOM tree. Threlte's event-payload fields move between versions — verify the exact shape against the current `interactivity` docs for `@threlte/extras` v9.

---

*Stack assumed: Svelte ^5.49, SvelteKit 2, Tailwind 4, Threlte core 8 / extras 9.*
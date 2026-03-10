<script lang="ts">
	import NavButton from "$lib/components/ui/NavButton.svelte";
</script>

<div
		class="
		fixed z-50 bottom-0 md:top-0 md:bottom-auto
		flex h-16 w-full items-center justify-center gap-4
		bg-linear-to-b from-white/10 from-0% to-orange-300/90 to-100%
		md:bg-linear-to-b md:from-orange-300/90 md:from-0% md:to-white/10 md:to-100%
		backdrop-blur-sm
		shadow-[0_-8px_30px_rgba(0,0,0,0.08)] md:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
	"
>
<!--	CURSED SHADOW PLS TAILWIND-->
	<NavButton href="/">Home</NavButton>
	<NavButton href="/about">About</NavButton>
	<NavButton href="/contact">Contact</NavButton>
	<NavButton href="/blog">Blog</NavButton>
	<NavButton href="/projects">Projects</NavButton>
	<NavButton href="/resume">Resume</NavButton>
	<NavButton href="/contact">Contact</NavButton>
</div>

<style>
</style>

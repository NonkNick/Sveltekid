<script lang="ts">
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";

	import NavButton from "$lib/components/ui/NavButton.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { toggleMode } from "mode-watcher";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import LoginForm from "$lib/components/login-form.svelte";


</script>

<div
	class="
		bottom-0 md:top-0 md:bottom-auto h-16 gap-4
		from-white/10 to-orange-300/90 md:bg-linear-to-b md:from-orange-300/90 md:from-0% md:to-white/10
		md:to-100% backdrop-blur-sm md:shadow-[0_8px_30px_rgba(0,0,0,0.08)] fixed z-50
		flex w-full items-center justify-center bg-linear-to-b
		from-0%
		to-100% shadow-[0_-8px_30px_rgba(0,0,0,0.08)]
	"
>
	<!--	CURSED SHADOW PLS TAILWIND-->
	<NavButton href="/">Home</NavButton>
	<NavButton href="/about">About</NavButton>
	<NavButton href="/contact">Contact</NavButton>
	<NavButton href="/blog">Blog</NavButton>
	<Button onclick={toggleMode} variant="outline" size="icon">
		<SunIcon class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
		<MoonIcon class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0" />
		<span class="sr-only">Toggle theme</span>
	</Button>
	<Popover.Root>
		<Popover.Trigger>
			<Button variant="outline">Login</Button>
		</Popover.Trigger>
		<Popover.Content>
			<LoginForm />
		</Popover.Content>
	</Popover.Root>

</div>

<style>
</style>

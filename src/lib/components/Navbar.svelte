<script lang="ts">
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
	import { toggleMode } from "mode-watcher";
	import LoginForm from "$lib/components/login-form.svelte";
</script>

<div
		class="
		fixed z-50 flex h-16 w-full items-center justify-center gap-4
		bottom-0 md:top-0 md:bottom-auto
		bg-linear-to-b from-white/10 to-orange-300/90 from-0% to-100%
		md:bg-linear-to-b md:from-orange-300/90 md:from-0% md:to-white/10 md:to-100%
		backdrop-blur-sm
		shadow-[0_-8px_30px_rgba(0,0,0,0.08)] md:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
	"
>
	<NavigationMenu.Root>
		<NavigationMenu.List class="gap-2">
			<NavigationMenu.Item>
				<NavigationMenu.Link>
					{#snippet child()}
						<a href="/" class={navigationMenuTriggerStyle()}>Home</a>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Trigger>Pages</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<ul class="grid w-[220px] gap-2 p-2">
						<li>
							<NavigationMenu.Link href="/about">About</NavigationMenu.Link>
						</li>
						<li>
							<NavigationMenu.Link href="/contact">Contact</NavigationMenu.Link>
						</li>
						<li>
							<NavigationMenu.Link href="/blog">Blog</NavigationMenu.Link>
						</li>
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>

	<Popover.Root>
		<Popover.Trigger>
			<Button variant="outline">Login</Button>
		</Popover.Trigger>
		<Popover.Content>
			<LoginForm />
		</Popover.Content>
	</Popover.Root>

	<Button onclick={toggleMode} variant="outline" size="icon">
		<SunIcon class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
		<MoonIcon class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0" />
		<span class="sr-only">Toggle theme</span>
	</Button>
</div>
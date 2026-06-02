<script lang="ts">
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
	import { toggleMode } from "mode-watcher";
	import { authClient } from "$lib/auth-client";
	import { MediaQuery } from "svelte/reactivity";
	import UserNavbar from "$lib/components/UserNavbar.svelte";
	import { ui } from "$lib/stores/ui.svelte";

	const session = authClient.useSession();

	let open = $state(false);
	let isRegistering = $state(false);

	// reset registering state when closing the drawer/popover
	$effect(() => {
		if (!open) {
			isRegistering = false;
		}
	});

	const isDesktop = new MediaQuery("(min-width: 425px)");
</script>

<div
	class="navbar fixed bottom-0 z-50 flex h-16
         w-full items-center justify-center gap-4
          border-t border-border/60 bg-linear-to-b from-0% to-100%
         shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors duration-300
         md:top-0 md:bottom-auto
         md:border-t-0 md:border-b md:border-border/60 md:shadow-[0_8px_30px_rgba(0,0,0,0.12)]
"
>
	<NavigationMenu.Root>
		<NavigationMenu.List class="flex items-center justify-center gap-4">
			<NavigationMenu.Item>
				<NavigationMenu.Link>
					{#snippet child()}
						<a onclick={() => (ui.hidden = false)} href="/" class={navigationMenuTriggerStyle()}> Home </a>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Link>
					{#snippet child()}
						<a href="/game" class={navigationMenuTriggerStyle()}>Game</a>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Link>
					{#snippet child()}
						<a href="/user" class={navigationMenuTriggerStyle()}>Settings</a>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Trigger>Studio</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<ul class="grid w-[300px] gap-2 p-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
						<li>
							<NavigationMenu.Link>
								{#snippet child()}
									<a
										href="/studio/threlte"
										class="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
									>
										<div class="text-sm leading-none font-medium">Threlte Studio</div>
										<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">Threlte Studio.</p>
									</a>
								{/snippet}
							</NavigationMenu.Link>
						</li>

						<li>
							<NavigationMenu.Link>
								{#snippet child()}
									<a
										href="/studio/theatre"
										class="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
									>
										<div class="text-sm leading-none font-medium">Theatre.JS Studio</div>
										<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">Theatre.JS Studio.</p>
									</a>
								{/snippet}
							</NavigationMenu.Link>
						</li>
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<Button onclick={toggleMode} variant="outline" size="icon" class={navigationMenuTriggerStyle()}>
					<SunIcon class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
					<MoonIcon
						class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<UserNavbar />
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
</div>

<style>
	.navbar {
		background: var(--navbar-gradient);
	}
</style>

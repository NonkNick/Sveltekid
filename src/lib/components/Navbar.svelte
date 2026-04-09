<script lang="ts">
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
	import { toggleMode, mode } from "mode-watcher";
	import LoginForm from "$lib/components/LoginForm.svelte";
	import { authClient } from "$lib/auth-client";
	import {MediaQuery} from "svelte/reactivity";
	const session = authClient.useSession();


	let isRegistering = $state(false);
	let open = $state(false);
	const isDesktop = new MediaQuery("(min-width: 768px)");

</script>

<div
		class="
	h-16 gap-4 bottom-0 md:top-0 md:bottom-auto
	backdrop-blur-sm md:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
	fixed z-50 flex w-full items-center justify-center
	bg-linear-to-b from-0% to-100%
	shadow-[0_-8px_30px_rgba(0,0,0,0.08)]

	/* navbar gradient */
	from-white/10 to-orange-300/90
	md:from-orange-300/90 md:to-white/10
	dark:from-zinc-900/20 dark:to-orange-400/40
	md:dark:from-orange-400/40 md:dark:to-zinc-900/20

	transition-colors duration-300
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
				{#if $session.data}
					<span class="text-sm">Welcome, {$session.data.user.email}</span>
				{:else}
					{#if isDesktop.current}
						<Popover.Root bind:open>
							<Popover.Trigger>
								<Button variant="outline" class={navigationMenuTriggerStyle()}>Login</Button>
							</Popover.Trigger>
							<Popover.Content>
								<LoginForm />
							</Popover.Content>
						</Popover.Root>
					{:else}
						<Drawer.Root bind:open>
							<Drawer.Trigger>
								<Button variant="outline">Login</Button>
							</Drawer.Trigger>
							<Drawer.Content class="pt-5">
							{#if isRegistering}
									<Label class="text-center text-lg font-semibold mb-4">Register</Label>
									<p class="text-center text-sm text-muted-foreground">Registration form placeholder</p>
							{:else }
								<Drawer.Header class="text-start">
									<Drawer.Title>Login</Drawer.Title>
									<Drawer.Description>
										Make changes to your profile here. Click save when you're done.
									</Drawer.Description>
								</Drawer.Header>
								<LoginForm />
								<div class="flex flex-1 grow flex-row items-center gap-2">
									<Button type="submit" class="w-1/2" onclick={() => isRegistering = true}>
										Register
									</Button>
								</div>
								<Button variant="link" class="text-sm text-center mt-4" onclick={() => isRegistering = true}>Register</Button>
							{/if}
							</Drawer.Content>
						</Drawer.Root>
					{/if }
				{/if}
			</NavigationMenu.Item>
			<NavigationMenu.Item>
				<Button onclick={toggleMode} variant="outline" size="icon" class={navigationMenuTriggerStyle()}>
					<SunIcon class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
					<MoonIcon class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0" />
					<span class="sr-only">Toggle theme</span>
				</Button>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
</div>

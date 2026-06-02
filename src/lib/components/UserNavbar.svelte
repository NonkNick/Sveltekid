<script lang="ts">
	import CircleUser from "@lucide/svelte/icons/circle-user";
	import CogIcon from "@lucide/svelte/icons/cog";
	import LogOutIcon from "@lucide/svelte/icons/log-out";
	import { Button } from "$lib/components/ui/button";
	import * as Popover from "$lib/components/ui/popover";
	import * as Drawer from "$lib/components/ui/drawer";
	import { Label } from "$lib/components/ui/label";
	import { navigationMenuTriggerStyle } from "./ui/navigation-menu/navigation-menu-trigger.svelte";
	import LoginForm from "$lib/components/LoginForm.svelte";
	import { MediaQuery } from "svelte/reactivity";
	import { browser } from "$app/environment";
	import * as Avatar from "$lib/components/ui/avatar";
	import RegisterForm from "$lib/components/RegisterForm.svelte";

	import { page } from "$app/state";
	import { authClient } from "$lib/auth-client";

	const session = authClient.useSession();
	// Use server-loaded user first (avoids flash), then stay reactive to client-side auth
	const user = $derived($session.data?.user ?? page.data.user ?? null);
	// console.log(user);
	// console.log('rendering', { browser });

	// TODO: hydratie probleem, do onMount?

	let isRegistering = $state(false);
	// reset registering state when closing the drawer/popover
	$effect(() => {
		if (!open) {
			isRegistering = false;
		}
	});

	async function handleLogout() {
		await authClient.signOut();
	}

	let open = $state(false);
	let userMenuOpen = $state(false);

	const isDesktop = new MediaQuery("(min-width: 768px)");
</script>

{#if user}
	{#if isDesktop.current}
		<Popover.Root bind:open={userMenuOpen}>
			<Popover.Trigger class="flex flex-row items-center gap-2 rounded-lg">
				<Avatar.Root class="">
					<Avatar.Image class="dark:invert" src={user.image ?? "/default_profile_img.svg"} />

					<Avatar.Fallback>
						<Avatar.Image class="dark:invert" src="/default_profile_img.svg" />
					</Avatar.Fallback>
					<!--        <span class="text-sm">{user.name}</span>-->
				</Avatar.Root>
			</Popover.Trigger>
			<Popover.Content class="w-64 p-2.5">
				<div class="flex items-start justify-between gap-2">
					<div class="flex min-w-0 items-center gap-3">
						<Avatar.Root class="size-10">
							<Avatar.Image class="dark:invert" src={user.image ?? "/default_profile_img.svg"} alt={user.name} />
							<Avatar.Fallback>
								<Avatar.Image class="dark:invert" src="/default_profile_img.svg" />
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="min-w-0">
							<p class="truncate text-sm font-medium">{user.name}</p>
							<p class="truncate text-xs text-muted-foreground">{user.email}</p>
						</div>
					</div>
					<Button href="/user" variant="ghost" size="icon" title="User settings" onclick={() => (userMenuOpen = false)}>
						<CogIcon class="size-4" />
						<span class="sr-only">User settings</span>
					</Button>
				</div>

				<div class="my-2.5 border-t border-border"></div>

				<Button variant="outline" class="w-full" onclick={handleLogout}>
					<LogOutIcon class="size-4" />
					Logout
				</Button>
			</Popover.Content>
		</Popover.Root>
		<!--        TODO: Maak Drawer een global Page en verplaats naar layout. interne dingen veranderen via store-->
	{:else}
		<Drawer.Root bind:open={userMenuOpen}>
			<Drawer.Trigger class="flex flex-row items-center gap-2 rounded-lg">
				<Avatar.Root class="">
					<Avatar.Image class="dark:invert" src={user.image ?? "/default_profile_img.svg"} />

					<Avatar.Fallback><Avatar.Image src="/default_profile_img.svg" /></Avatar.Fallback>
					<!--        <span class="text-sm">{user.name}</span>-->
				</Avatar.Root>
			</Drawer.Trigger>

			<Drawer.Content class="p-2.5 pt-5">
				<Drawer.Header class="text-start">
					<div class="flex items-start justify-between gap-2">
						<div class="flex min-w-0 items-center gap-3">
							<Avatar.Root class="size-10">
								<Avatar.Image class="dark:invert" src={user.image ?? "/default_profile_img.svg"} alt={user.name} />
								<Avatar.Fallback>
									<Avatar.Image class="dark:invert" src="/default_profile_img.svg" />
								</Avatar.Fallback>
							</Avatar.Root>
							<div class="min-w-0 text-start">
								<Drawer.Title class="truncate">{user.name}</Drawer.Title>
								<Drawer.Description class="truncate">{user.email}</Drawer.Description>
							</div>
						</div>
						<Button
							href="/user"
							variant="ghost"
							size="icon"
							title="User settings"
							onclick={() => (userMenuOpen = false)}
						>
							<CogIcon class="size-4" />
							<span class="sr-only">User settings</span>
						</Button>
					</div>
				</Drawer.Header>
				<Button variant="outline" class="w-full" onclick={handleLogout}>
					<LogOutIcon class="size-4" />
					Logout
				</Button>
			</Drawer.Content>
		</Drawer.Root>
	{/if}
{:else if isDesktop.current}
	<Popover.Root bind:open>
		<Popover.Trigger>
			<Button variant="outline" class={navigationMenuTriggerStyle()}>Login</Button>
		</Popover.Trigger>
		<Popover.Content class="p-2.5">
			{#if isRegistering}
				<Label class="mb-4 text-center text-lg font-semibold">Register</Label>
				<RegisterForm />
			{:else}
				<LoginForm />
				<Button type="submit" class="w-full" onclick={() => (isRegistering = true)}>Register</Button>
			{/if}
		</Popover.Content>
	</Popover.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger>
			<Button variant="outline">Login</Button>
		</Drawer.Trigger>
		<Drawer.Content class="p-2.5 pt-5">
			<!--						// REGISTER-->
			{#if isRegistering}
				<Label class="mb-4 text-center text-lg font-semibold">Register</Label>
				<p class="text-center text-sm text-muted-foreground">Registration form placeholder</p>

				<!--						// LOGIN-->
			{:else}
				<Drawer.Header class="text-start">
					<Drawer.Title>Login</Drawer.Title>
					<Drawer.Description>Make changes to your profile here. Click save when you're done.</Drawer.Description>
				</Drawer.Header>
				<LoginForm />
				<div class="flex flex-1 grow flex-row items-center gap-2">
					<Button type="submit" class="w-full" onclick={() => (isRegistering = true)}>Register</Button>
				</div>
			{/if}
		</Drawer.Content>
	</Drawer.Root>
{/if}

<style>
</style>

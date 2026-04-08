<script lang="ts">
	import { enhance } from "$app/forms";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { FieldGroup, Field, FieldLabel, FieldDescription } from "$lib/components/ui/field/index.js";
	import { createAuthClient } from "better-auth/svelte";
	// import type { ActionData } from "./$types";

	// let { form }: { form: ActionData } = $props();
	export const authClient = createAuthClient({
		// you can pass client configuration here
	});

	async function handle(email: string, password: string) {}
</script>

<!--<h1 class="text-2xl font-bold mb-4">Login</h1>-->

<!-- Email/password login + register -->
<form method="post" on:submit={handleSubmit}" use:enhance>
	<FieldGroup>
		<Field>
			<FieldLabel>Email
				<Input
						type="email"
						name="email"
						placeholder="m@example.com"
						required
				/>
			</FieldLabel>
		</Field>

		<Field>
			<div class="flex flex-1 flex-col justify-between items-center gap-2">
				<FieldLabel>Password
					<Input
							type="password"
							name="password"
							required
					/>
				</FieldLabel>
				<a href="##" class="text-[12px] underline ">Forgot your password?</a>
			</div>
		</Field>

<!--		<Field>-->
<!--			<FieldLabel>Name (for registration)-->
<!--				<Input-->
<!--						name="name"-->
<!--						placeholder="Optional"-->
<!--				/>-->
<!--			</FieldLabel>-->
<!--		</Field>-->

		<Field>
			<div class="flex flex-1 grow flex-row items-center gap-2">
				<Button
						type="submit"
						class="w-1/2"
						variant="secondary">
					Login
				</Button>
				<Button
						type="submit"
						formaction="?/signUpEmail"
						class="w-1/2"
						variant="default"
				>
					Register
				</Button>
			</div>
<!--			variant: {-->
<!--				default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",-->
<!--				outline:-->
<!--				"border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground",-->
<!--				secondary:-->
<!--				"bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",-->
<!--				ghost:-->
<!--				"hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",-->
<!--				destructive:-->
<!--				"bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30",-->
<!--				link: "text- -->
			<FieldDescription class="text-center mt-2 text-red-500">
				{form?.message ?? ""}
			</FieldDescription>
		</Field>
	</FieldGroup>
</form>

<!--<hr class="my-6" />-->

<!--&lt;!&ndash; Social login &ndash;&gt;-->
<!--<form method="post" action="?/signInSocial" use:enhance>-->
<!--	<input type="hidden" name="provider" value="github" />-->
<!--	<input type="hidden" name="callbackURL" value="/demo/better-auth" />-->
<!--	<Button type="submit" class="w-full">Sign in with GitHub</Button>-->
<!--</form>-->
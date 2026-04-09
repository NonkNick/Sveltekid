<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { FieldGroup, Field, FieldLabel, FieldDescription } from "$lib/components/ui/field/index.js";


	import { authClient } from "$lib/auth-client";
	const session = authClient.useSession();

	let email = "";
	let password = "";
	let errorMessage = "";

	const handleSubmit = async () => {
		errorMessage = "";

		const { data, error } = await authClient.signIn.email({
			email,
			password,
			rememberMe: true
		});

		if (error) {
			errorMessage = error.message ?? "Login failed";
			console.error(error);
		} else {
			console.log(data);
		}
	};
</script>

<!--<h1 class="text-2xl font-bold mb-4">Login</h1>-->

<form on:submit|preventDefault={handleSubmit}>
	<FieldGroup>
		<Field>
			<FieldLabel>Email
				<Input
						type="email"
						name="email"
						placeholder="m@example.com"
						bind:value={email}
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
							bind:value={password}
							required
					/>
				</FieldLabel>
				<a href="##" class="text-[12px] underline">Forgot your password?</a>
			</div>
		</Field>

		<Field>
				<Button type="submit" class="w-1/2" variant="secondary">
					Login
				</Button>
<!--				<Button type="submit" class="w-1/2" variant="secondary">-->
<!--				Register-->
<!--				</Button>-->

			<FieldDescription class="text-center mt-2 text-red-500">
				{errorMessage}
			</FieldDescription>
		</Field>
	</FieldGroup>
</form>
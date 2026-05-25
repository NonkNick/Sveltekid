<script lang="ts">
	import { enhance } from "$app/forms";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { FieldGroup, Field, FieldLabel, FieldDescription } from "$lib/components/ui/field/index.js";
	import type { PageServerData } from "./$types";

	let { data, form }: { data: PageServerData; form: { success?: boolean } | null } = $props();

	let name = $state(data?.user?.name ?? "");
	let image = $state(data?.user?.image ?? "");
</script>

<h1 class="mb-4 text-2xl font-bold">Account Settings</h1>

<form method="post" action="?/updateProfile" use:enhance>
	<FieldGroup>
		<Field>
			<FieldLabel
				>Display Name
				<Input type="text" name="name" bind:value={name} required />
			</FieldLabel>
		</Field>

		<Field>
			<FieldLabel
				>Email
				<Input type="email" value={data?.user?.email ?? ""} disabled />
			</FieldLabel>
			<FieldDescription>Email cannot be changed</FieldDescription>
		</Field>

		<Field>
			<FieldLabel
				>Profile Image URL
				<Input type="url" name="image" bind:value={image} placeholder="https://..." />
			</FieldLabel>
		</Field>

		<Field>
			<Button type="submit" variant="secondary">Save Changes</Button>
			{#if form?.success}
				<FieldDescription class="text-green-500">Settings saved!</FieldDescription>
			{/if}
		</Field>
	</FieldGroup>
</form>

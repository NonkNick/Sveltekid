<script lang="ts">
	import * as Field from "$lib/components/ui/field/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import MailIcon from "@lucide/svelte/icons/mail";
	import UserIcon from "@lucide/svelte/icons/user";
	import { enhance } from "$app/forms";
	import { toast } from "svelte-sonner";

	import type { ActionResult } from "@sveltejs/kit";

	type EnhanceCallback = (input: {
		result: ActionResult;
		update: (options?: { reset?: boolean }) => Promise<void>;
	}) => Promise<void>;

	let { user }: { user: any } = $props();
	let name = $state(user.name);
	let email = $state(user.email);

	const DEFAULT_IMAGE = "/default_profile_img.svg";

	// Avatar form state: file input ref, the picked file's local preview, and a busy flag.
	let fileInput: HTMLInputElement;
	let previewUrl = $state<string | null>(null);
	let selectedFile = $state<File | null>(null);
	let uploading = $state(false);

	// What to show in the avatar: the local preview while picking, otherwise the saved image.
	let displayedImage = $derived(previewUrl ?? user.image ?? DEFAULT_IMAGE);

	function handleFileSelect(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			toast.error("Please choose an image file");
			input.value = "";
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image too large (max 5MB)");
			input.value = "";
			return;
		}

		if (previewUrl) URL.revokeObjectURL(previewUrl);
		selectedFile = file;
		previewUrl = URL.createObjectURL(file);
	}

	function clearSelection() {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		previewUrl = null;
		selectedFile = null;
		if (fileInput) fileInput.value = "";
	}

	function handleUpdate(): EnhanceCallback {
		return async ({ result, update }) => {
			if (result.type === "success") {
				toast.success("Settings updated successfully");
				await update();
			} else if (result.type === "failure") {
				toast.error((result.data as any)?.message || "Failed to update settings");
			}
		};
	}

	function handleImageUpload(): EnhanceCallback {
		uploading = true;
		return async ({ result, update }) => {
			uploading = false;
			if (result.type === "success") {
				toast.success("Profile picture updated");
				clearSelection();
				await update();
			} else if (result.type === "failure") {
				toast.error((result.data as any)?.message || "Failed to upload image");
			}
		};
	}

	function handleImageRemove(): EnhanceCallback {
		uploading = true;
		return async ({ result, update }) => {
			uploading = false;
			if (result.type === "success") {
				toast.success("Profile picture removed");
				clearSelection();
				await update();
			} else if (result.type === "failure") {
				toast.error((result.data as any)?.message || "Failed to remove image");
			}
		};
	}

	$effect(() => {
		name = user.name;
		email = user.email;
	});
</script>

<Field.Set>
	<Field.Legend>User Settings</Field.Legend>
	<Field.Description>Manage your account settings and profile information.</Field.Description>
	<Field.Separator />

	<Field.Group class="@container/field-group">
		<!--
			The avatar lives in its own forms (upload / remove) so it isn't nested inside
			the profile-details form below — nested <form> elements are invalid HTML.
		-->
		<Field.Field orientation="responsive">
			<Field.Content>
				<Field.Label>Profile Picture</Field.Label>
				<Field.Description>Upload a profile picture , up to 5MB.</Field.Description>
			</Field.Content>
			<div class="flex items-center gap-4">
				<Avatar.Root data-size="lg" class="size-16">
					<Avatar.Image src={displayedImage} alt={name} />
					<Avatar.Fallback>
						<UserIcon class="size-6" />
					</Avatar.Fallback>
				</Avatar.Root>

				<!-- A single persistent file input keeps the picked file across UI changes. -->
				<form
					method="POST"
					action="?/uploadImage"
					enctype="multipart/form-data"
					use:enhance={handleImageUpload}
					class="flex items-center gap-2"
				>
					<input
						bind:this={fileInput}
						type="file"
						name="image"
						accept="image/png,image/jpeg,image/webp,image/gif"
						class="hidden"
						onchange={handleFileSelect}
					/>

					{#if selectedFile}
						<Button type="submit" disabled={uploading}>
							{uploading ? "Uploading…" : "Upload"}
						</Button>
						<Button type="button" variant="ghost" onclick={clearSelection} disabled={uploading}>Cancel</Button>
					{:else}
						<Button type="button" variant="outline" onclick={() => fileInput.click()} disabled={uploading}>
							Change picture
						</Button>
					{/if}
				</form>

				{#if user.image && !selectedFile}
					<form method="POST" action="?/removeImage" use:enhance={handleImageRemove}>
						<Button type="submit" variant="ghost" disabled={uploading}>Remove</Button>
					</form>
				{/if}
			</div>
		</Field.Field>

		<Field.Separator />

		<!-- Profile details: its own form so the avatar forms above stay independent. -->
		<form method="POST" action="?/update" use:enhance={handleUpdate}>
			<Field.Group>
				<Field.Field orientation="responsive">
					<Field.Content>
						<Field.Label for="name">Full Name</Field.Label>
						<Field.Description>This is your public display name.</Field.Description>
					</Field.Content>
					<InputGroup.Root>
						<InputGroup.Addon>
							<UserIcon class="size-4" />
						</InputGroup.Addon>
						<InputGroup.Input id="name" name="name" bind:value={name} placeholder="John Doe" />
					</InputGroup.Root>
				</Field.Field>

				<Field.Separator />

				<Field.Field orientation="responsive">
					<Field.Content>
						<Field.Label for="email">Email Address</Field.Label>
						<Field.Description>Your primary contact email.</Field.Description>
					</Field.Content>
					<InputGroup.Root>
						<InputGroup.Addon>
							<MailIcon class="size-4" />
						</InputGroup.Addon>
						<InputGroup.Input id="email" name="email" type="email" bind:value={email} placeholder="john@example.com" />
					</InputGroup.Root>
				</Field.Field>

				<Field.Separator />

				<Field.Field orientation="responsive">
					<div class="flex items-center gap-2">
						<Button type="submit">Save Changes</Button>
						<Button variant="outline" type="button">Cancel</Button>
					</div>
				</Field.Field>
			</Field.Group>
		</form>
	</Field.Group>
</Field.Set>

<style>
</style>

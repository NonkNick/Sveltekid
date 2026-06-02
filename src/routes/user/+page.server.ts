import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { getUserById, updateUser } from "$lib/server/queries/user";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

/* Where avatars live on disk, and the URL prefix they're served from.
   Files written under `static/` are served at the site root by Vite/SvelteKit. */
const UPLOAD_DIR = "static/uploads/avatars";
const PUBLIC_PREFIX = "/uploads/avatars";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
// mime type -> file extension. Doubles as the allow-list.
const ALLOWED_TYPES = new Map([
	["image/png", "png"],
	["image/jpeg", "jpg"],
	["image/webp", "webp"],
	["image/gif", "gif"]
]);

/** Delete a previously uploaded avatar, but only if it's one we own (lives under PUBLIC_PREFIX). */
async function removeOwnedFile(image: string | null | undefined) {
	if (!image || !image.startsWith(PUBLIC_PREFIX + "/")) return;
	await unlink(join("static", image)).catch(() => {}); // best-effort: ignore if already gone
}

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.user ? await getUserById(locals.user.id) : null
	};
};

export const actions: Actions = {
	update: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { message: "Unauthorized" });
		}

		const formData = await request.formData();
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;

		if (!name || !email) {
			return fail(400, { message: "Name and email are required" });
		}

		try {
			await updateUser(user.id, { name, email });
			return { success: true };
		} catch (e) {
			console.error(e);
			return fail(500, { message: "Failed to update user" });
		}
	},

	uploadImage: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { message: "Unauthorized" });
		}

		const formData = await request.formData();
		const file = formData.get("image");

		if (!(file instanceof File) || file.size === 0) {
			return fail(400, { message: "No image provided" });
		}

		const ext = ALLOWED_TYPES.get(file.type);
		if (!ext) {
			return fail(400, { message: "Unsupported image type. Use PNG, JPEG, WebP or GIF." });
		}
		if (file.size > MAX_BYTES) {
			return fail(400, { message: "Image too large (max 5MB)." });
		}

		try {
			await mkdir(UPLOAD_DIR, { recursive: true });

			// Timestamp keeps the URL unique so browsers don't serve a stale cached avatar.
			const filename = `${user.id}-${Date.now()}.${ext}`;
			const buffer = Buffer.from(await file.arrayBuffer());
			await writeFile(join(UPLOAD_DIR, filename), buffer);

			const previous = await getUserById(user.id);
			const publicPath = `${PUBLIC_PREFIX}/${filename}`;
			await updateUser(user.id, { image: publicPath });

			// Drop the old file only after the DB points at the new one.
			await removeOwnedFile(previous?.image);

			return { success: true, image: publicPath };
		} catch (e) {
			console.error(e);
			return fail(500, { message: "Failed to upload image" });
		}
	},

	removeImage: async ({ locals }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { message: "Unauthorized" });
		}

		try {
			const previous = await getUserById(user.id);
			await updateUser(user.id, { image: null });
			await removeOwnedFile(previous?.image);
			return { success: true, image: null };
		} catch (e) {
			console.error(e);
			return fail(500, { message: "Failed to remove image" });
		}
	}
};

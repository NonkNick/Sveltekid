import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { auth } from "$lib/server/auth";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, "/");
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	updateProfile: async (event) => {
		if (!event.locals.user) {
			return redirect(302, "/");
		}

		const formData = await event.request.formData();
		const name = formData.get("name") as string;
		const image = formData.get("image") as string;

		await auth.api.updateUser({
			headers: event.request.headers,
			body: { name, image: image || undefined }
		});

		return { success: true };
	}
};

import type { PageServerLoad, Actions } from "./$types";
import { error } from "@sveltejs/kit";
import { getRecentPosts, createPost } from "$lib/server/queries/posts";

export const load: PageServerLoad = async () => {
	return { posts: await getRecentPosts() };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		const title = data.get("title") as string;
		const content = data.get("content") as string;

		if (!locals.user) throw error(401, "Not logged in");

		await createPost({ title, content, authorId: locals.user.id });
	}
};

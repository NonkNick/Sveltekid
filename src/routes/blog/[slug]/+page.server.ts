import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { getPostBySlug, getCommentsByPostId, createComment, voteComment } from "$lib/server/queries/posts";

export const load: PageServerLoad = async ({ params, locals }) => {
	const post = await getPostBySlug(params.slug);
	if (!post) throw error(404, "Post not found");

	return {
		post,
		comments: await getCommentsByPostId(post.id, locals.user?.id)
	};
};

export const actions: Actions = {
	comment: async ({ request, locals, params }) => {
		const user = locals.user;
		if (!user) return fail(401, { message: "You must be signed in to comment" });

		const post = await getPostBySlug(params.slug);
		if (!post) return fail(404, { message: "Post not found" });

		const formData = await request.formData();
		const content = (formData.get("content") as string)?.trim();
		const parentId = (formData.get("parentId") as string) || null;

		if (!content) return fail(400, { message: "Comment cannot be empty" });

		try {
			await createComment({ postId: post.id, authorId: user.id, content, parentId });
			return { success: true };
		} catch (e) {
			console.error(e);
			return fail(500, { message: "Failed to post comment" });
		}
	},

	vote: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) return fail(401, { message: "You must be signed in to vote" });

		const formData = await request.formData();
		const commentId = formData.get("commentId") as string;
		const value = Number(formData.get("value"));

		if (!commentId || ![1, -1, 0].includes(value)) {
			return fail(400, { message: "Invalid vote" });
		}

		try {
			await voteComment({ commentId, userId: user.id, value });
			return { success: true };
		} catch (e) {
			console.error(e);
			return fail(500, { message: "Failed to register vote" });
		}
	}
};

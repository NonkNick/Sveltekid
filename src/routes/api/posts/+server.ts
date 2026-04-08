import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { post } from "$lib/server/db/posts.schema";

export async function POST({ request, locals }) {
	const { title, content } = await request.json();

	if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });

	const newPost = await db
		.insert(post)
		.values({
			authorId: locals.user.id,
			title,
			slug: title.toLowerCase().replace(/\s+/g, "-"), // generate
			content
		})
		.returning();

	return json(newPost);
}

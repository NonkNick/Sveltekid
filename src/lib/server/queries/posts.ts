import { db } from "../db/index";
import { post } from "../db/posts.schema";
import { eq, desc, sql } from "drizzle-orm";
import { user } from "$lib/server/db/auth.schema";

export async function createPost(input: {
	title: string;
	content: string;
	authorId: string; // match post.authorId's type — string if it FKs Better-Auth's user.id
}) {
	const slug = await generateUniqueSlug(input.title);

	return db.insert(post).values({
		title: input.title,
		slug,
		content: { text: input.content }, // wrap into your JSON column shape here
		authorId: input.authorId
	});
}

export async function getRecentPosts(limit: number = 5) {
	const rows = await db
		.select()
		.from(post)
		.innerJoin(user, eq(post.authorId, user.id)) // after .from, before orderBy/limit
		.orderBy(desc(post.createdAt))
		.limit(limit);

	return rows.map((row) => ({
		...row.post,
		author: { id: row.user.id, name: row.user.name }
	}));
}

export async function getPostBySlug(slug: string) {
	const rows = await db
		.select()
		.from(post)
		.innerJoin(user, eq(post.authorId, user.id))
		.where(eq(post.slug, slug))
		.limit(1);

	const [row] = rows;
	if (!row) return null;
	return { ...row.post, author: { id: row.user.id, name: row.user.name } };
}

function toBaseSlug(title: string): string {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(title: string): Promise<string> {
	const base = toBaseSlug(title);

	const existing = await db
		.select({ slug: post.slug })
		.from(post)
		.where(sql`${post.slug} ~ ${"^" + base + "(-[0-9]+)?$"}`);

	if (existing.length === 0) return base;

	const numbers = existing.map(({ slug }: { slug: string }) => {
		if (slug === base) return 0;
		const match = slug.match(/-(\d+)$/);
		return match ? parseInt(match[1]) : 0;
	});

	return `${base}-${Math.max(...numbers) + 1}`;
}

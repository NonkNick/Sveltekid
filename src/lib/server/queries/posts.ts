import { db } from "../db/index";
import { post, comment, commentVote } from "../db/posts.schema";
import { eq, and, desc, asc, sql } from "drizzle-orm";
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

// flat shape coming straight out of the DB, before we thread it into a tree
export type CommentRow = {
	id: string;
	postId: string;
	parentId: string | null;
	content: string;
	createdAt: Date;
	authorId: string;
	authorName: string;
	authorImage: string | null;
	score: number;
	userVote: number; // current user's vote on this comment: 1, -1 or 0
};

// nested comment passed to the UI: same row plus its replies
export type CommentNode = CommentRow & { replies: CommentNode[] };

/**
 * Fetch every comment on a post, with author info, aggregate score and the
 * current user's own vote, then nest replies under their parents.
 */
export async function getCommentsByPostId(postId: string, userId?: string): Promise<CommentNode[]> {
	const rows = await db
		.select({
			id: comment.id,
			postId: comment.postId,
			parentId: comment.parentId,			content: comment.content,			createdAt: comment.createdAt,
			authorId: comment.authorId,
			authorName: user.name,
			authorImage: user.image,
			score: sql<number>`coalesce(sum(${commentVote.value}), 0)`.mapWith(Number),
			userVote: userId
				? sql<number>`coalesce(sum(case when ${commentVote.userId} = ${userId} then ${commentVote.value} else 0 end), 0)`.mapWith(
						Number
					)
				: sql<number>`0`.mapWith(Number)
		})
		.from(comment)
		.innerJoin(user, eq(comment.authorId, user.id))
		.leftJoin(commentVote, eq(commentVote.commentId, comment.id))
		.where(eq(comment.postId, postId))
		.groupBy(comment.id, user.id)
		.orderBy(asc(comment.createdAt));

	// thread the flat rows: every node gets a replies array, then attach to parent
	const byId = new Map<string, CommentNode>();
	for (const row of rows) {
		byId.set(row.id, { ...row, replies: [] });
	}

	const roots: CommentNode[] = [];
	for (const node of byId.values()) {
		const parent = node.parentId ? byId.get(node.parentId) : undefined;
		if (parent) {
			parent.replies.push(node);
		} else {
			roots.push(node);
		}
	}

	return roots;
}

export async function createComment(input: {
	postId: string;
	authorId: string;
	content: string;
	parentId?: string | null;
}) {
	const [row] = await db
		.insert(comment)
		.values({
			postId: input.postId,
			authorId: input.authorId,
			content: input.content,
			parentId: input.parentId ?? null
		})
		.returning();

	return row;
}

/**
 * Upsert a user's vote on a comment. value of 1 = upvote, -1 = downvote,
 * 0 = remove the vote (e.g. toggling off the current direction).
 */
export async function voteComment(input: { commentId: string; userId: string; value: number }) {
	if (input.value === 0) {
		return db
			.delete(commentVote)
			.where(and(eq(commentVote.commentId, input.commentId), eq(commentVote.userId, input.userId)));
	}

	return db
		.insert(commentVote)
		.values({ commentId: input.commentId, userId: input.userId, value: input.value })
		.onConflictDoUpdate({
			target: [commentVote.commentId, commentVote.userId],
			set: { value: input.value }
		});
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

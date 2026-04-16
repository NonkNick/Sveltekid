import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { post } from "../db/posts.schema";

/**
 * Get a single post by slug (for blog page)
 */
export async function getPostBySlug(slug: string) {
    const result = await db
        .select()
        .from(post)
        .where(eq(post.slug, slug))
        .limit(1);

    return result[0] ?? null;
}

/**
 * Get all published posts (for blog index page)
 */
export async function getPublishedPosts() {
    return await db
        .select()
        .from(post)
        .where(eq(post.status, "published"))
        .orderBy(post.createdAt);
}

/**
 * Get posts by author
 */
export async function getPostsByAuthor(authorId: string) {
    return await db
        .select()
        .from(post)
        .where(eq(post.authorId, authorId))
        .orderBy(post.createdAt);
}

/**
 * Create a post
 */
export async function createPost(data: {
    authorId: string;
    title: string;
    slug: string;
    content: unknown; // jsonb
    status?: "draft" | "published" | "archived";
}) {
    const result = await db
        .insert(post)
        .values({
            ...data,
            status: data.status ?? "draft"
        })
        .returning();

    return result[0];
}

/**
 * Update post by slug
 */
export async function updatePostBySlug(
    slug: string,
    data: Partial<{
        title: string;
        content: unknown;
        status: "draft" | "published" | "archived";
    }>
) {
    const result = await db
        .update(post)
        .set(data)
        .where(eq(post.slug, slug))
        .returning();

    return result[0] ?? null;
}

/**
 * Delete post by slug
 */
export async function deletePostBySlug(slug: string) {
    const result = await db
        .delete(post)
        .where(eq(post.slug, slug))
        .returning();

    return result[0] ?? null;
}
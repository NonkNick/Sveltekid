import { db } from "../db/index";
import { post } from "../db/posts.schema";
import { eq, desc } from "drizzle-orm";

export async function getRecentPosts(limit: number = 5) {
    return db
        .select()
        .from(post)
        // .where(eq(post.status, "published"))
        .orderBy(desc(post.createdAt))
        .limit(limit);
}
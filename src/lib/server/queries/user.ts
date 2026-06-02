import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { user } from "$lib/server/db/auth.schema";

/* ------------------------------------------------------------------ */
/* Reads                                                               */
/* ------------------------------------------------------------------ */

/**
 * The workhorse read: one query, full row, or null if no user has that id.
 * Prefer this when you need more than one field — it's a single round-trip.
 */
export async function getUserById(id: string) {
	const [row] = await db.select().from(user).where(eq(user.id, id)).limit(1);
	return row ?? null;
}

type UpdatableUserFields = {
	name: string;
	email: string;
	image: string | null; // URL of the uploaded image, or null to clear it
};

/**
 * Edit an existing user. Pass only the fields you want to change, e.g.
 *   updateUser(id, { name: "New Name" })
 *   updateUser(id, { name, image })
 *
 * Returns the updated row, or null if no user matched `id`.
 *
 * You never set `updatedAt` here: the schema's `.$onUpdate(() => new Date())`
 * injects a fresh Date into every UPDATE automatically.
 */
export async function updateUser(id: string, data: Partial<UpdatableUserFields>) {
	// Drizzle throws on an empty .set({}); short-circuit to a plain read.
	if (Object.keys(data).length === 0) return getUserById(id);

	const [row] = await db.update(user).set(data).where(eq(user.id, id)).returning();
	return row ?? null;
}

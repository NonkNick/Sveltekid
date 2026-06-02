import {
	pgTable,
	text,
	timestamp,
	pgEnum,
	uuid,
	jsonb,
	integer,
	index,
	primaryKey,
	type AnyPgColumn
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth.schema";

export const postStatusEnum = pgEnum("post_status", ["draft", "published", "archived"]);

export const post = pgTable("post", {
	id: uuid("id").defaultRandom().primaryKey(),
	authorId: text("author_id")
		.notNull()
		.references(() => user.id, { onDelete: "restrict" }),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	content: jsonb("content").notNull(),
	publishedAt: timestamp("published_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const postRelations = relations(post, ({ one, many }) => ({
	author: one(user, {
		fields: [post.authorId],
		references: [user.id]
	}),
	comments: many(comment)
}));

// nested comments: parentId self-references comment.id so replies can thread
export const comment = pgTable(
	"comment",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		postId: uuid("post_id")
			.notNull()
			.references(() => post.id, { onDelete: "cascade" }),
		authorId: text("author_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		parentId: uuid("parent_id").references((): AnyPgColumn => comment.id, {
			onDelete: "cascade"
		}),
		content: text("content").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index("comment_postId_idx").on(table.postId), index("comment_parentId_idx").on(table.parentId)]
);

// one row per (comment, user); value is +1 (upvote) or -1 (downvote)
export const commentVote = pgTable(
	"comment_vote",
	{
		commentId: uuid("comment_id")
			.notNull()
			.references(() => comment.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		value: integer("value").notNull()
	},
	(table) => [primaryKey({ columns: [table.commentId, table.userId] })]
);

export const commentRelations = relations(comment, ({ one, many }) => ({
	post: one(post, {
		fields: [comment.postId],
		references: [post.id]
	}),
	author: one(user, {
		fields: [comment.authorId],
		references: [user.id]
	}),
	parent: one(comment, {
		fields: [comment.parentId],
		references: [comment.id],
		relationName: "comment_replies"
	}),
	replies: many(comment, { relationName: "comment_replies" }),
	votes: many(commentVote)
}));

export const commentVoteRelations = relations(commentVote, ({ one }) => ({
	comment: one(comment, {
		fields: [commentVote.commentId],
		references: [comment.id]
	}),
	user: one(user, {
		fields: [commentVote.userId],
		references: [user.id]
	})
}));

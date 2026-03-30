import {pgTable, text, timestamp, pgEnum, uuid, jsonb} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.schema';

export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'archived']);

export const post = pgTable('post', {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: text('author_id')
        .notNull()
        .references(() => user.id, { onDelete: 'restrict' }),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    content: jsonb('content').notNull(),
    status: postStatusEnum('status').notNull().default('draft'),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull()
});

export const postRelations = relations(post, ({ one }) => ({
    author: one(user, {
        fields: [post.authorId],
        references: [user.id]
    })
}));
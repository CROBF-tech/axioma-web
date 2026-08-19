import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const notebooks = sqliteTable(
  "notebooks",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id").notNull(),
    title: text("title").notNull(),
    folderId: text("folder_id"),
    accent: text("accent"),
    isPublic: integer("is_public", { mode: "boolean" }).notNull().default(false),
    publicSlug: text("public_slug").unique(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [
    index("notebooks_owner_idx").on(t.ownerId),
    index("notebooks_owner_updated_idx").on(t.ownerId, t.updatedAt),
    index("notebooks_slug_idx").on(t.publicSlug),
  ],
);

export type NotebookRow = typeof notebooks.$inferSelect;
export type NewNotebookRow = typeof notebooks.$inferInsert;

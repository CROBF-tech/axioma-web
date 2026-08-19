import { integer, sqliteTable, text, index, foreignKey } from "drizzle-orm/sqlite-core";

export const folders = sqliteTable(
  "folders",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    parentId: text("parent_id"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [
    foreignKey({
      name: "folders_parent_id_fk",
      columns: [t.parentId],
      foreignColumns: [t.id],
    }).onDelete("set null"),
    index("folders_owner_idx").on(t.ownerId),
    index("folders_parent_idx").on(t.parentId),
  ],
);

export type FolderRow = typeof folders.$inferSelect;
export type NewFolderRow = typeof folders.$inferInsert;

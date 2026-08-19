import { integer, sqliteTable, text, index, foreignKey } from "drizzle-orm/sqlite-core";
import { notebooks } from "./notebooks";

export const cells = sqliteTable(
  "cells",
  {
    id: text("id").primaryKey(),
    notebookId: text("notebook_id")
      .notNull(),
    orderIdx: integer("order_idx").notNull(),
    kind: text("kind", { enum: ["math", "text", "plot"] }).notNull(),
    input: text("input").notNull(),
    output: text("output"),
    references: text("references", { mode: "json" }).$type<string[] | null>(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [
    foreignKey({
      name: "cells_notebook_id_fk",
      columns: [t.notebookId],
      foreignColumns: [notebooks.id],
    }).onDelete("cascade"),
    index("cells_notebook_idx").on(t.notebookId),
    index("cells_notebook_order_idx").on(t.notebookId, t.orderIdx),
  ],
);

export type CellRow = typeof cells.$inferSelect;
export type NewCellRow = typeof cells.$inferInsert;

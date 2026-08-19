import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const subscriptions = sqliteTable(
  "subscriptions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    plan: text("plan", { enum: ["monthly", "annual"] }).notNull(),
    status: text("status", {
      enum: ["active", "pending", "cancelled", "expired"],
    }).notNull(),
    mpPreapprovalId: text("mp_preapproval_id"),
    currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [index("subscriptions_status_idx").on(t.status)],
);

export type SubscriptionRow = typeof subscriptions.$inferSelect;
export type NewSubscriptionRow = typeof subscriptions.$inferInsert;

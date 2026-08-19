import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  cells,
  folders,
  notebooks,
  subscriptions,
} from "@axioma/db/schema";

export type { ID } from "./constants.ts";

export type Notebook = InferSelectModel<typeof notebooks>;
export type NewNotebook = InferInsertModel<typeof notebooks>;

export type Cell = InferSelectModel<typeof cells>;
export type NewCell = InferInsertModel<typeof cells>;

export type Folder = InferSelectModel<typeof folders>;
export type NewFolder = InferInsertModel<typeof folders>;

export type Subscription = InferSelectModel<typeof subscriptions>;
export type NewSubscription = InferInsertModel<typeof subscriptions>;

export type CellKind = Cell["kind"];
export type SubscriptionPlan = Subscription["plan"];
export type SubscriptionStatus = Subscription["status"];

export * from "./constants.ts";
export * from "./validators.ts";
export * from "./slugs.ts";
export * from "./tree.ts";
export * from "./sort.ts";
export * from "./subscription.ts";
export * from "./notebook.ts";
export * from "./cell.ts";
export * from "./plot.ts";
export * from "./sync.ts";
export * from "./keyboard.ts";
export * from "./schemas.ts";
export * from "./types.ts";
// Tipos compartidos entre web y api.
// El source-of-truth es packages/db/src/schema/*; aquí se re-exportan inferidos.

import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  notebooks,
  cells,
  folders,
  subscriptions,
} from "@axioma/db/schema";

export type ID = string;

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

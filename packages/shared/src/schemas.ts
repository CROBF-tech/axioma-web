import { z } from "zod";
import type { ID, Notebook } from "./index.ts";
import { CELL_KINDS, SUBSCRIPTION_PLANS } from "./constants.ts";

const CellKindSchema = z.enum(CELL_KINDS);
const SubscriptionPlanSchema = z.enum(SUBSCRIPTION_PLANS);
const SubscriptionStatusEnumSchema = z.enum([
  "active",
  "pending",
  "cancelled",
  "expired",
  "none",
]);

const NotebookSchema: z.ZodType<Notebook> = z.custom<Notebook>(
  (v) => typeof v === "object" && v !== null,
);

const IdSchema: z.ZodType<ID> = z.string().min(1);

export const CreateNotebookRequestSchema = z.object({
  title: z.string().max(200).optional(),
  accent: z.string().optional(),
  folderId: z.string().nullable().optional(),
});
export type CreateNotebookRequest = z.infer<typeof CreateNotebookRequestSchema>;

export const UpdateNotebookRequestSchema = z.object({
  title: z.string().max(200).optional(),
  accent: z.string().optional(),
  folderId: z.string().nullable().optional(),
});
export type UpdateNotebookRequest = z.infer<typeof UpdateNotebookRequestSchema>;

export const ListNotebooksResponseSchema = z.object({
  items: z.array(NotebookSchema),
  nextCursor: z.string().nullable(),
});
export type ListNotebooksResponse = z.infer<typeof ListNotebooksResponseSchema>;

export const CreateCellRequestSchema = z.object({
  kind: CellKindSchema,
  input: z.string().optional(),
  orderIdx: z.number().optional(),
});
export type CreateCellRequest = z.infer<typeof CreateCellRequestSchema>;

export const UpdateCellRequestSchema = z.object({
  input: z.string().optional(),
  output: z.unknown().optional(),
  references: z.array(IdSchema).optional(),
  orderIdx: z.number().optional(),
});
export type UpdateCellRequest = z.infer<typeof UpdateCellRequestSchema>;

export const ReorderRequestSchema = z.object({
  order: z.array(IdSchema),
});
export type ReorderRequest = z.infer<typeof ReorderRequestSchema>;

export const CreateFolderRequestSchema = z.object({
  name: z.string(),
  parentId: z.string().nullable(),
});
export type CreateFolderRequest = z.infer<typeof CreateFolderRequestSchema>;

export const UpdateFolderRequestSchema = z.object({
  name: z.string().optional(),
  parentId: z.string().nullable().optional(),
});
export type UpdateFolderRequest = z.infer<typeof UpdateFolderRequestSchema>;

export const CheckoutRequestSchema = z.object({
  plan: SubscriptionPlanSchema,
});
export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;

export const CheckoutResponseSchema = z.object({
  init_point: z.string(),
});
export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;

export const SubscriptionStatusResponseSchema = z.object({
  status: SubscriptionStatusEnumSchema,
  plan: SubscriptionPlanSchema.nullable(),
  current_period_end: z.string().nullable(),
});
export type SubscriptionStatusResponse = z.infer<typeof SubscriptionStatusResponseSchema>;
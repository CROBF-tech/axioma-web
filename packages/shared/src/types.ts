import type { ERROR_CODES, MP_EVENT_TYPES } from "./constants.ts";
import type { ID } from "./constants.ts";

export type Step = { label: string; latex: string; rule?: string };

export type EngineResult = {
  ok: boolean;
  latex?: string;
  steps: Step[];
  partial?: boolean;
  engine: "cortex" | "nerdamer";
  error?: { message: string; until?: string };
};

export type ComputeKind = "derivative" | "integral" | "limit" | "simplify" | "evaluate";

export type ComputeInput = {
  kind: ComputeKind;
  expr: string;
  variable?: string;
  bounds?: [string, string];
  point?: string;
};

export type ComputeOutput = EngineResult;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type ApiError = { error: string; code: ErrorCode; details?: unknown };

export type SyncEntity = "notebook" | "cell" | "folder";

export type SyncOp = "create" | "update" | "delete";

export type SyncQueueEntry = {
  id?: number;
  entity: SyncEntity;
  entityId: ID;
  op: SyncOp;
  payload: unknown;
  createdAt: number;
  conflict?: boolean;
};

export type MpEventType = (typeof MP_EVENT_TYPES)[number];

export type PlotSpec = {
  fns: Array<{ fn: string; color?: string }>;
  range?: { x?: [number, number]; y?: [number, number] };
};
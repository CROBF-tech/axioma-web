import type {
  Step,
  EngineResult,
  ComputeInput,
  ComputeOutput,
  ComputeKind,
} from "@axioma/shared";

export { parse, getEngine } from "./compute-engine.ts";
export type { Expr } from "./compute-engine.ts";
export { derivative, limit, simplify, evaluate } from "./operations.ts";
export { integral } from "./integral.ts";
export { extractSteps, stepsFromLatex } from "./steps.ts";
export { compute } from "./compute.ts";

export type {
  Step,
  EngineResult,
  ComputeInput,
  ComputeOutput,
  ComputeKind,
};
import type { ComputeInput, EngineResult } from "@axioma/shared";
import { derivative, limit, simplify, evaluate } from "./operations.ts";
import { integral } from "./integral.ts";

export async function compute(input: ComputeInput): Promise<EngineResult> {
  switch (input.kind) {
    case "derivative":
      return derivative(input.expr, input.variable ?? "x");
    case "integral":
      return integral(input.expr, input.variable ?? "x");
    case "limit":
      return limit(input.expr, input.point ?? "0", "both");
    case "simplify":
      return simplify(input.expr);
    case "evaluate":
      return evaluate(input.expr);
  }
}
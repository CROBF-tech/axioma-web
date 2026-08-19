import { ComputeEngine } from "@cortex-js/compute-engine";
import type { BoxedExpression } from "@cortex-js/compute-engine";

export type Expr = BoxedExpression;

let ceInstance: ComputeEngine | null = null;

export function getEngine(): ComputeEngine {
  if (!ceInstance) {
    ceInstance = new ComputeEngine();
  }
  return ceInstance;
}

export type ParseResult = Expr | { error: string };

export function parse(latex: string): ParseResult {
  try {
    const ce = getEngine();
    const expr = ce.parse(latex);
    if (expr === null) {
      return { error: `No se pudo parsear: ${latex}` };
    }
    if (!expr.isValid) {
      const errs = expr.errors;
      const messages = errs.map((e) => e.toString()).join("; ");
      return { error: messages || `Expresión inválida: ${latex}` };
    }
    return expr;
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export function isError(r: ParseResult): r is { error: string } {
  return "error" in r;
}
import type { EngineResult } from "@axioma/shared";
import { getEngine, parse, isError } from "./compute-engine.ts";
import { extractSteps } from "./steps.ts";

function isResolved(expr: { toLatex: () => string }): boolean {
  const latex = expr.toLatex();
  return !latex.includes("?") && latex.trim().length > 0;
}

export function derivative(latex: string, variable = "x"): EngineResult {
  const ce = getEngine();
  const parsed = parse(latex);
  if (isError(parsed)) {
    return {
      ok: false,
      steps: [],
      engine: "cortex",
      error: { message: parsed.error },
    };
  }
  try {
    const expr = ce.box(["D", parsed, variable]);
    const evaluated = expr.evaluate();
    const resultLatex = evaluated.toLatex();
    const initialLatex = expr.toLatex();
    const partial = !isResolved(evaluated) || resultLatex === initialLatex;
    const steps = extractSteps(expr);
    if (!partial) {
      steps.push({ label: "Resultado", latex: resultLatex, rule: "Evaluate" });
    }
    return {
      ok: !partial,
      latex: resultLatex,
      steps,
      ...(partial ? { partial: true } : {}),
      engine: "cortex",
    };
  } catch (e) {
    return {
      ok: false,
      steps: [],
      engine: "cortex",
      error: { message: (e as Error).message },
    };
  }
}

export function limit(
  latex: string,
  point: string,
  direction: "+" | "-" | "both" = "both",
): EngineResult {
  const ce = getEngine();
  const parsed = parse(latex);
  if (isError(parsed)) {
    return {
      ok: false,
      steps: [],
      engine: "cortex",
      error: { message: parsed.error },
    };
  }
  try {
    const directionSpec =
      direction === "both"
        ? "Both"
        : direction === "+"
          ? "FromAbove"
          : "FromBelow";
    const expr = ce.box(["Limit", parsed, "x", point, directionSpec]);
    const evaluated = expr.evaluate();
    const resultLatex = evaluated.toLatex();
    const initialLatex = expr.toLatex();
    const partial = !isResolved(evaluated) || resultLatex === initialLatex;
    const steps = extractSteps(expr);
    if (!partial) {
      steps.push({ label: "Resultado", latex: resultLatex, rule: "Evaluate" });
    }
    return {
      ok: !partial,
      latex: resultLatex,
      steps,
      ...(partial ? { partial: true } : {}),
      engine: "cortex",
    };
  } catch (e) {
    return {
      ok: false,
      steps: [],
      engine: "cortex",
      error: { message: (e as Error).message },
    };
  }
}

export function simplify(latex: string): EngineResult {
  const parsed = parse(latex);
  if (isError(parsed)) {
    return {
      ok: false,
      steps: [],
      engine: "cortex",
      error: { message: parsed.error },
    };
  }
  try {
    const simplified = parsed.simplify();
    const resultLatex = simplified.toLatex();
    const initialLatex = parsed.toLatex();
    const partial = resultLatex === initialLatex;
    const steps = extractSteps(parsed);
    if (!partial) {
      steps.push({ label: "Resultado", latex: resultLatex, rule: "Simplify" });
    }
    return {
      ok: !partial,
      latex: resultLatex,
      steps,
      ...(partial ? { partial: true } : {}),
      engine: "cortex",
    };
  } catch (e) {
    return {
      ok: false,
      steps: [],
      engine: "cortex",
      error: { message: (e as Error).message },
    };
  }
}

export function evaluate(latex: string): EngineResult {
  const parsed = parse(latex);
  if (isError(parsed)) {
    return {
      ok: false,
      steps: [],
      engine: "cortex",
      error: { message: parsed.error },
    };
  }
  try {
    const evaluated = parsed.evaluate();
    const resultLatex = evaluated.toLatex();
    const initialLatex = parsed.toLatex();
    const partial = resultLatex === initialLatex;
    const steps = extractSteps(parsed);
    if (!partial) {
      steps.push({ label: "Resultado", latex: resultLatex, rule: "Evaluate" });
    }
    return {
      ok: !partial,
      latex: resultLatex,
      steps,
      ...(partial ? { partial: true } : {}),
      engine: "cortex",
    };
  } catch (e) {
    return {
      ok: false,
      steps: [],
      engine: "cortex",
      error: { message: (e as Error).message },
    };
  }
}
import { expand } from "@cortex-js/compute-engine";
import type { FunctionInterface } from "@cortex-js/compute-engine";
import type { Step } from "@axioma/shared";
import type { Expr } from "./compute-engine.ts";
import { getEngine } from "./compute-engine.ts";

function asFunction(expr: Expr): FunctionInterface | null {
  if (expr.isFunction) {
    return expr as unknown as FunctionInterface;
  }
  return null;
}

function walkOps(expr: Expr): Step[] {
  const steps: Step[] = [];
  const fn = asFunction(expr);
  if (!fn) {
    return steps;
  }
  const ops = fn.ops;
  const head = expr.operator;
  const latex = expr.toLatex();
  steps.push({
    label: `Aplicar ${head}`,
    latex,
    rule: head,
  });
  for (const o of ops) {
    const sub = walkOps(o);
    if (sub.length > 0) {
      steps.push(...sub.filter((s) => s.latex !== latex));
    }
  }
  return steps;
}

function deriveByRules(expr: Expr): Step[] {
  const steps: Step[] = [];
  const initialLatex = expr.toLatex();
  steps.push({ label: "Expresión inicial", latex: initialLatex });

  try {
    const simplified = expr.simplify();
    const simpLatex = simplified.toLatex();
    if (simpLatex !== initialLatex) {
      steps.push({
        label: "Simplificar",
        latex: simpLatex,
        rule: "Simplify",
      });
    }
  } catch {
    // ignore
  }

  try {
    const expanded = expand(expr);
    const expLatex = expanded.toLatex();
    if (expLatex !== initialLatex && !steps.some((s) => s.latex === expLatex)) {
      steps.push({
        label: "Expandir",
        latex: expLatex,
        rule: "Expand",
      });
    }
  } catch {
    // ignore
  }

  return steps;
}

export function extractSteps(expr: Expr): Step[] {
  const opsSteps = walkOps(expr);
  if (opsSteps.length >= 2) {
    return opsSteps;
  }
  const rulesSteps = deriveByRules(expr);
  if (rulesSteps.length > 0) {
    return rulesSteps;
  }
  return [{ label: "Expresión", latex: expr.toLatex() }];
}

export function stepsFromLatex(latex: string): Step[] {
  try {
    const ce = getEngine();
    const expr = ce.parse(latex);
    if (expr === null) {
      return [{ label: "Entrada", latex }];
    }
    return extractSteps(expr);
  } catch {
    return [{ label: "Entrada", latex }];
  }
}
import type { EngineResult } from "@axioma/shared";
import { getEngine, parse, isError } from "./compute-engine.ts";
import { extractSteps } from "./steps.ts";

function isUnresolved(latex: string): boolean {
  return latex.includes("?") || latex.includes("Integrate") || latex.trim() === "";
}

export async function integral(
  latex: string,
  variable = "x",
): Promise<EngineResult> {
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
    const expr = ce.box(["Integrate", parsed, variable]);
    const evaluated = expr.evaluate();
    const resultLatex = evaluated.toLatex();
    const initialLatex = expr.toLatex();
    const cortexPartial =
      isUnresolved(resultLatex) || resultLatex === initialLatex;

    if (!cortexPartial) {
      const steps = extractSteps(expr);
      steps.push({
        label: "Resultado",
        latex: resultLatex,
        rule: "Integrate",
      });
      return {
        ok: true,
        latex: resultLatex,
        steps,
        engine: "cortex",
      };
    }
  } catch {
    // cortex falló, intentar nerdamer
  }

  try {
    const nerdamerModule = await import("nerdamer");
    const nerdamer = nerdamerModule.default;
    const nerdamerResult = nerdamer.integrate(latex, variable);
    const nerdamerLatex = nerdamerResult.toTeX();
    if (!isUnresolved(nerdamerLatex) && nerdamerLatex.trim().length > 0) {
      return {
        ok: true,
        latex: nerdamerLatex,
        steps: [
          { label: "Entrada", latex },
          {
            label: "Resultado (nerdamer)",
            latex: nerdamerLatex,
            rule: "Integrate",
          },
        ],
        engine: "nerdamer",
      };
    }
  } catch (e) {
    return {
      ok: false,
      steps: [],
      engine: "nerdamer",
      error: { message: (e as Error).message },
    };
  }

  const parsed2 = parse(latex);
  const fallbackSteps = isError(parsed2)
    ? [{ label: "Entrada", latex }]
    : extractSteps(parsed2);
  return {
    ok: false,
    steps: fallbackSteps,
    partial: true,
    engine: "cortex",
    error: { message: "Ningún motor resolvió la integral" },
  };
}
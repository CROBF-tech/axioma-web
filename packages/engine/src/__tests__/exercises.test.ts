import { describe, it, expect } from "vitest";
import type { ComputeInput } from "@axioma/shared";
import { compute, derivative, limit, integral, parse } from "../index.ts";

type Exercise = {
  id: string;
  category: "derivative" | "limit" | "integral";
  latex: string;
  expectResolved: boolean;
  variable?: string;
  point?: string;
};

const exercises: Exercise[] = [
  { id: "d1", category: "derivative", latex: "x^2", expectResolved: true },
  { id: "d2", category: "derivative", latex: "\\sin(x^2)", expectResolved: true },
  { id: "d3", category: "derivative", latex: "x \\ln(x)", expectResolved: true },
  { id: "d4", category: "derivative", latex: "\\frac{1}{x}", expectResolved: true },
  { id: "d5", category: "derivative", latex: "\\arctan(x)", expectResolved: true },
  { id: "l1", category: "limit", latex: "\\frac{\\sin(x)}{x}", expectResolved: true, point: "0" },
  { id: "l2", category: "limit", latex: "\\frac{1 - \\cos(x)}{x^2}", expectResolved: true, point: "0" },
  { id: "l3", category: "limit", latex: "\\frac{e^x - 1}{x}", expectResolved: true, point: "0" },
  { id: "l4", category: "limit", latex: "\\frac{\\ln(1+x)}{x}", expectResolved: true, point: "0" },
  { id: "l5", category: "limit", latex: "x", expectResolved: true, point: "0" },
  { id: "i1", category: "integral", latex: "x^2", expectResolved: true },
  { id: "i2", category: "integral", latex: "\\cos(x)", expectResolved: true },
  { id: "i3", category: "integral", latex: "\\frac{1}{x}", expectResolved: true },
  { id: "i4", category: "integral", latex: "e^x", expectResolved: true },
  { id: "i5", category: "integral", latex: "x \\sin(x)", expectResolved: true },
];

describe("parse", () => {
  it("parsea fracción válida sin throw", () => {
    const r = parse("\\frac{1}{x}");
    expect("error" in r).toBe(false);
  });

  it("retorna error para LaTeX inválido sin throw", () => {
    const r = parse("x^(");
    expect("error" in r).toBe(true);
  });
});

describe("derivative", () => {
  it("d/dx x^2 = 2x", () => {
    const r = derivative("x^2");
    expect(r.engine).toBe("cortex");
    expect(r.ok).toBe(true);
    const latex = r.latex ?? "";
    expect(latex).toMatch(/2.*x|2x|x.*2/);
  });

  it("d/dx sin(x^2) tiene al menos 1 paso", () => {
    const r = derivative("\\sin(x^2)");
    expect(r.steps.length).toBeGreaterThan(0);
  });

  it("d/dx 1/x resuelve", () => {
    const r = derivative("\\frac{1}{x}");
    expect(r.ok).toBe(true);
  });
});

describe("limit", () => {
  it("lim sin(x)/x -> 1", () => {
    const r = limit("\\frac{\\sin(x)}{x}", "0", "both");
    expect(r.ok).toBe(true);
    expect(r.latex).toContain("1");
  });

  it("lim x -> 0 = 0", () => {
    const r = limit("x", "0", "both");
    expect(r.ok).toBe(true);
  });
});

describe("integral", () => {
  it("integral de x^2 dx resuelve (cortex o nerdamer)", async () => {
    const r = await integral("x^2");
    expect(r.ok).toBe(true);
    expect(r.latex).toBeTruthy();
  });

  it("integral de cos(x) dx resuelve", async () => {
    const r = await integral("\\cos(x)");
    expect(r.ok).toBe(true);
  });

  it("integral de 1/x dx resuelve", async () => {
    const r = await integral("\\frac{1}{x}");
    expect(r.ok).toBe(true);
  });
});

describe("compute dispatch", () => {
  it("compute({ kind: 'derivative', expr: 'x^2' }) funciona", async () => {
    const r = await compute({ kind: "derivative", expr: "x^2" });
    expect(r.ok).toBe(true);
  });

  it("compute({ kind: 'limit', expr: 'x', point: '0' }) funciona", async () => {
    const r = await compute({ kind: "limit", expr: "x", point: "0" });
    expect(r.ok).toBe(true);
  });
});

describe("set de ejercicios 01-T02", () => {
  for (const ex of exercises) {
    it(`${ex.id} (${ex.category}) ${ex.latex}`, async () => {
      const input: ComputeInput = {
        kind: ex.category,
        expr: ex.latex,
        variable: ex.variable,
        ...(ex.point ? { point: ex.point } : {}),
      };
      const r = await compute(input);
      if (ex.expectResolved) {
        expect(r.ok, `esperaba ok=true, got ${JSON.stringify(r)}`).toBe(true);
        expect(r.partial ?? false, `esperaba partial=false`).toBe(false);
      } else {
        expect(r.partial ?? false, `esperaba partial=true`).toBe(true);
        expect(r.steps.length, `esperaba steps.length > 0`).toBeGreaterThan(0);
      }
    });
  }
});
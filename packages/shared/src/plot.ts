export function latexToJsExpr(latex: string): string {
  let s = latex;

  s = s.replace(/\\frac\s*\{([^{}]*)\}\{([^{}]*)\}/g, (_m, a: string, b: string) => `(${a}/${b})`);
  s = s.replace(/\\sin\b/g, "Math.sin");
  s = s.replace(/\\cos\b/g, "Math.cos");
  s = s.replace(/\\tan\b/g, "Math.tan");
  s = s.replace(/\\log\b/g, "Math.log");
  s = s.replace(/\\ln\b/g, "Math.log");
  s = s.replace(/\\sqrt\b/g, "Math.sqrt");
  s = s.replace(/\\pi\b/g, "Math.PI");
  s = s.replace(/\^\{([^{}]+)\}/g, (_m, n: string) => `**${n}`);
  s = s.replace(/\^(-?\d+(?:\.\d+)?)/g, (_m, n: string) => `**${n}`);

  return s;
}

export function splitFunctions(input: string): string[] {
  if (input.trim().length === 0) return [];
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === "(" || ch === "{") depth++;
    else if (ch === ")" || ch === "}") depth--;
    else if (ch === ";" && depth === 0) {
      out.push(input.slice(start, i));
      start = i + 1;
    }
  }
  const tail = input.slice(start);
  if (tail.trim().length > 0) out.push(tail);
  return out;
}
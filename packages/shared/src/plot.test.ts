import { describe, it, expect } from "vitest";
import { latexToJsExpr, splitFunctions } from "./plot.ts";

describe("latexToJsExpr", () => {
  it("converts \\frac{a}{b}", () => {
    expect(latexToJsExpr("\\frac{a}{b}")).toBe("(a/b)");
  });

  it("converts \\frac with whitespace", () => {
    expect(latexToJsExpr("\\frac {a}{b}")).toBe("(a/b)");
  });

  it("converts \\sin", () => {
    expect(latexToJsExpr("\\sin x")).toBe("Math.sin x");
  });

  it("converts \\cos", () => {
    expect(latexToJsExpr("\\cos x")).toBe("Math.cos x");
  });

  it("converts \\tan", () => {
    expect(latexToJsExpr("\\tan x")).toBe("Math.tan x");
  });

  it("converts \\log", () => {
    expect(latexToJsExpr("\\log x")).toBe("Math.log x");
  });

  it("converts \\ln to Math.log", () => {
    expect(latexToJsExpr("\\ln x")).toBe("Math.log x");
  });

  it("converts \\sqrt", () => {
    expect(latexToJsExpr("\\sqrt{x}")).toBe("Math.sqrt{x}");
  });

  it("converts \\pi", () => {
    expect(latexToJsExpr("\\pi")).toBe("Math.PI");
  });

  it("converts caret power x^2", () => {
    expect(latexToJsExpr("x^2")).toBe("x**2");
  });

  it("converts brace power x^{2}", () => {
    expect(latexToJsExpr("x^{2}")).toBe("x**2");
  });

  it("converts negative brace power x^{-1}", () => {
    expect(latexToJsExpr("x^{-1}")).toBe("x**-1");
  });

  it("converts combined expression", () => {
    const input = "\\frac{\\sin(x)}{\\cos(x)} + \\sqrt{x^2}";
    expect(latexToJsExpr(input)).toBe("(Math.sin(x)/Math.cos(x)) + Math.sqrt{x**2}");
  });
});

describe("splitFunctions", () => {
  it("returns empty array for empty string", () => {
    expect(splitFunctions("")).toEqual([]);
  });

  it("returns empty array for whitespace-only string", () => {
    expect(splitFunctions("   ")).toEqual([]);
  });

  it("returns one function unchanged", () => {
    expect(splitFunctions("f(x)=x")).toEqual(["f(x)=x"]);
  });

  it("splits multiple functions by semicolon", () => {
    expect(splitFunctions("f(x)=x;g(x)=2*x")).toEqual(["f(x)=x", "g(x)=2*x"]);
  });

  it("ignores semicolons inside parentheses", () => {
    expect(splitFunctions("f(x)=(a;b);g(x)=x")).toEqual(["f(x)=(a;b)", "g(x)=x"]);
  });

  it("ignores semicolons inside braces", () => {
    expect(splitFunctions("f(x)={a;b};g(x)=x")).toEqual(["f(x)={a;b}", "g(x)=x"]);
  });

  it("ignores trailing semicolon without content", () => {
    expect(splitFunctions("f(x)=x;")).toEqual(["f(x)=x"]);
  });

  it("preserves spacing around split points", () => {
    expect(splitFunctions("a ; b")).toEqual(["a ", " b"]);
  });
});

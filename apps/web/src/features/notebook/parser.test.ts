import { describe, it, expect } from "vitest"
import { latexToJsExpr, parseLatexToFunctionPlotData, generatePlotColors } from "./parser.ts"

describe("latexToJsExpr", () => {
  it("converts \\sin(x) to Math.sin(x)", () => {
    expect(latexToJsExpr("\\sin(x)")).toBe("Math.sin(x)")
  })

  it("converts x^2 to x**2", () => {
    expect(latexToJsExpr("x^2")).toBe("x**2")
  })

  it("converts \\frac{1}{x} to ((1)/(x))", () => {
    expect(latexToJsExpr("\\frac{1}{x}")).toBe("((1)/(x))")
  })

  it("converts \\sqrt{x} to Math.sqrt(x)", () => {
    expect(latexToJsExpr("\\sqrt{x}")).toBe("Math.sqrt(x)")
  })

  it("converts plain sin(x) to Math.sin(x)", () => {
    expect(latexToJsExpr("sin(x)")).toBe("Math.sin(x)")
  })

  it("returns empty string for empty input", () => {
    expect(latexToJsExpr("")).toBe("")
  })

  it("returns empty string for whitespace input", () => {
    expect(latexToJsExpr("   ")).toBe("")
  })
})

describe("parseLatexToFunctionPlotData", () => {
  it("parses single function", () => {
    const result = parseLatexToFunctionPlotData("x^2", "#ff0000")
    expect(result).toEqual([{ fn: "x**2", color: "#ff0000" }])
  })

  it("parses multiple functions separated by semicolon", () => {
    const result = parseLatexToFunctionPlotData("sin(x); cos(x)", "#6366f1")
    expect(result).toHaveLength(2)
    expect(result[0]?.fn).toBe("Math.sin(x)")
    expect(result[1]?.fn).toBe("Math.cos(x)")
    expect(result[0]?.color).not.toBe(result[1]?.color)
  })

  it("ignores semicolons inside braces", () => {
    const result = parseLatexToFunctionPlotData("f(x)=x^{2;3}; cos(x)")
    expect(result).toHaveLength(2)
    expect(result[0]?.fn).toBe("x**(2;3)")
    expect(result[1]?.fn).toBe("Math.cos(x)")
  })

  it("strips f(x)= and y= prefixes", () => {
    const result = parseLatexToFunctionPlotData("f(x)=x^2; y=cos(x)")
    expect(result).toHaveLength(2)
    expect(result[0]?.fn).toBe("x**2")
    expect(result[1]?.fn).toBe("Math.cos(x)")
  })

  it("returns empty array for invalid input", () => {
    const result = parseLatexToFunctionPlotData("   ")
    expect(result).toEqual([])
  })
})

describe("generatePlotColors", () => {
  it("returns base color for count 1", () => {
    expect(generatePlotColors("#6366f1", 1)).toEqual(["#6366f1"])
  })

  it("returns distinct colors for multiple functions", () => {
    const colors = generatePlotColors("#6366f1", 3)
    expect(colors).toHaveLength(3)
    expect(new Set(colors).size).toBe(3)
  })
})

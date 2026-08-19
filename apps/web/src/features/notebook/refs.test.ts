import { describe, it, expect } from "vitest"
import { parseRefs, resolveRefs, validateRefs } from "./refs.ts"
import type { Cell } from "@axioma/db"

function makeCell(id: string, orderIdx: number, input: string, output?: string | null): Cell {
  return {
    id,
    notebookId: "nb1",
    orderIdx,
    kind: "math",
    input,
    output: output ?? null,
    references: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

describe("parseRefs", () => {
  it("extracts ids from $$id", () => {
    expect(parseRefs("2*$$a1 + $$b-2")).toEqual(["a1", "b-2"])
  })

  it("deduplicates repeated refs", () => {
    expect(parseRefs("$$x + $$x")).toEqual(["x"])
  })

  it("returns empty array when no refs", () => {
    expect(parseRefs("2+2")).toEqual([])
  })

  it("ignores malformed tokens", () => {
    expect(parseRefs("$$ $$ $$  x")).toEqual([])
  })
})

describe("resolveRefs", () => {
  it("replaces refs with output wrapped in parens", () => {
    const cells = [makeCell("a", 0, "x = 5", "5")]
    expect(resolveRefs("2*$$a", cells)).toBe("2*(5)")
  })

  it("falls back to input when output is null", () => {
    const cells = [makeCell("a", 0, "x + 1", null)]
    expect(resolveRefs("$$a", cells)).toBe("(x + 1)")
  })

  it("keeps unmatched refs unchanged", () => {
    expect(resolveRefs("$$missing", [])).toBe("$$missing")
  })
})

describe("validateRefs", () => {
  it("reports missing ids", () => {
    const cells = [makeCell("a", 0, "5", "5")]
    const result = validateRefs("$$a + $$b", cells, "c")
    expect(result.ok).toBe(false)
    expect(result.missing).toEqual(["b"])
    expect(result.cyclic).toBe(false)
  })

  it("detects cycles through reference chain", () => {
    const cells = [
      { ...makeCell("a", 0, "$$b", null), references: ["b"] },
      { ...makeCell("b", 1, "$$a", null), references: ["a"] },
    ]
    const result = validateRefs("$$b", cells, "a")
    expect(result.ok).toBe(false)
    expect(result.cyclic).toBe(true)
  })

  it("passes for valid refs", () => {
    const cells = [makeCell("a", 0, "5", "5")]
    expect(validateRefs("$$a", cells, "b")).toEqual({ ok: true, missing: [], cyclic: false })
  })
})

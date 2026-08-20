import { describe, it, expect } from "vitest";
import { reorderCells, parseRefs, extractRefIds, previousCellIds } from "./cell.ts";

describe("reorderCells", () => {
  it("reorders cells according to newOrder", () => {
    const cells = [
      { id: "a", orderIdx: 0 },
      { id: "b", orderIdx: 1 },
      { id: "c", orderIdx: 2 },
    ];
    const newOrder = ["c", "b", "a"];
    const result = reorderCells(cells, newOrder);
    expect(result.map((c) => c.id)).toEqual(["c", "b", "a"]);
    expect(result.map((c) => c.orderIdx)).toEqual([0, 1, 2]);
  });

  it("omits IDs not present in cells array", () => {
    const cells = [
      { id: "a", orderIdx: 0 },
      { id: "b", orderIdx: 1 },
    ];
    const newOrder = ["a", "x", "b", "y"];
    const result = reorderCells(cells, newOrder);
    expect(result.map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("handles duplicate IDs in newOrder by keeping first occurrence", () => {
    const cells = [
      { id: "a", orderIdx: 0 },
      { id: "b", orderIdx: 1 },
      { id: "c", orderIdx: 2 },
    ];
    const newOrder = ["a", "b", "a", "c", "b"];
    const result = reorderCells(cells, newOrder);
    expect(result.map((c) => c.id)).toEqual(["a", "b", "c"]);
  });

  it("appends cells not in newOrder at the end", () => {
    const cells = [
      { id: "a", orderIdx: 0 },
      { id: "b", orderIdx: 1 },
      { id: "c", orderIdx: 2 },
      { id: "d", orderIdx: 3 },
    ];
    const newOrder = ["c", "a"];
    const result = reorderCells(cells, newOrder);
    expect(result.map((c) => c.id)).toEqual(["c", "a", "b", "d"]);
  });

  it("returns empty array when cells is empty", () => {
    const cells: Array<{ id: string; orderIdx: number }> = [];
    const newOrder = ["a", "b"];
    const result = reorderCells(cells, newOrder);
    expect(result).toEqual([]);
  });

  it("returns empty array when newOrder is empty", () => {
    const cells = [
      { id: "a", orderIdx: 0 },
      { id: "b", orderIdx: 1 },
    ];
    const newOrder: string[] = [];
    const result = reorderCells(cells, newOrder);
    expect(result.map((c) => c.id)).toEqual(["a", "b"]);
    expect(result.map((c) => c.orderIdx)).toEqual([0, 1]);
  });

  it("updates orderIdx correctly after reordering", () => {
    const cells = [
      { id: "a", orderIdx: 10 },
      { id: "b", orderIdx: 20 },
      { id: "c", orderIdx: 30 },
    ];
    const newOrder = ["b", "c", "a"];
    const result = reorderCells(cells, newOrder);
    expect(result.map((c) => c.orderIdx)).toEqual([0, 1, 2]);
  });

  it("does not mutate original cells array", () => {
    const cells = [
      { id: "a", orderIdx: 0 },
      { id: "b", orderIdx: 1 },
    ];
    const originalOrderIdxs = cells.map((c) => c.orderIdx);
    const newOrder = ["b", "a"];
    reorderCells(cells, newOrder);
    expect(cells.map((c) => c.orderIdx)).toEqual(originalOrderIdxs);
  });
});

describe("parseRefs", () => {
  it("extracts single ref from input", () => {
    const input = "Check $$abc123 for details";
    const result = parseRefs(input);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      raw: "$$abc123",
      cellId: "abc123",
      start: 6,
      end: 14,
    });
  });

  it("extracts multiple refs from input", () => {
    const input = "$$first and $$second and $$third";
    const result = parseRefs(input);
    expect(result).toHaveLength(3);
    expect(result[0].cellId).toBe("first");
    expect(result[1].cellId).toBe("second");
    expect(result[2].cellId).toBe("third");
  });

  it("extracts refs with special characters in cellId", () => {
    const input = "$$cell_with-dash123";
    const result = parseRefs(input);
    expect(result).toHaveLength(1);
    expect(result[0].cellId).toBe("cell_with-dash123");
  });

  it("returns empty array for input without refs", () => {
    const input = "No references here";
    const result = parseRefs(input);
    expect(result).toEqual([]);
  });

  it("returns empty array for input with only $single", () => {
    const input = "$single";
    const result = parseRefs(input);
    expect(result).toEqual([]);
  });

  it("handles refs at the start of input", () => {
    const input = "$$start is here";
    const result = parseRefs(input);
    expect(result).toHaveLength(1);
    expect(result[0].start).toBe(0);
    expect(result[0].end).toBe(7);
  });

  it("handles refs at the end of input", () => {
    const input = "Go to $$end";
    const result = parseRefs(input);
    expect(result).toHaveLength(1);
    expect(result[0].raw).toBe("$$end");
  });

  it("handles consecutive refs without spaces", () => {
    const input = "$$a$$b$$c";
    const result = parseRefs(input);
    expect(result).toHaveLength(3);
    expect(result[0].cellId).toBe("a");
    expect(result[1].cellId).toBe("b");
    expect(result[2].cellId).toBe("c");
  });

  it("tracks correct start and end positions", () => {
    const input = "prefix $$ref1 suffix $$ref2";
    const result = parseRefs(input);
    expect(result[0].start).toBe(7);
    expect(result[0].end).toBe(13);
    expect(result[1].start).toBe(21);
    expect(result[1].end).toBe(27);
  });

  it("resets regex lastIndex before matching", () => {
    const input1 = "$$first";
    parseRefs(input1);
    const input2 = "$$second";
    const result = parseRefs(input2);
    expect(result).toHaveLength(1);
    expect(result[0].cellId).toBe("second");
  });
});

describe("extractRefIds", () => {
  it("extracts unique cell IDs from input", () => {
    const input = "$$a $$b $$c";
    const result = extractRefIds(input);
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("deduplicates repeated refs", () => {
    const input = "$$a $$b $$a $$c $$b $$a";
    const result = extractRefIds(input);
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("returns empty array for input without refs", () => {
    const input = "No refs here";
    const result = extractRefIds(input);
    expect(result).toEqual([]);
  });

  it("returns empty array for input with only $single", () => {
    const input = "$single";
    const result = extractRefIds(input);
    expect(result).toEqual([]);
  });

  it("preserves order of first occurrence", () => {
    const input = "$$z $$a $$m $$a $$z";
    const result = extractRefIds(input);
    expect(result).toEqual(["z", "a", "m"]);
  });
});

describe("previousCellIds", () => {
  it("returns all previous cell IDs", () => {
    const cells = [
      { id: "a" },
      { id: "b" },
      { id: "c" },
      { id: "d" },
    ];
    const result = previousCellIds(cells, "c");
    expect(result).toEqual(["a", "b"]);
  });

  it("returns empty array for first cell", () => {
    const cells = [
      { id: "a" },
      { id: "b" },
      { id: "c" },
    ];
    const result = previousCellIds(cells, "a");
    expect(result).toEqual([]);
  });

  it("returns empty array when currentCellId not found", () => {
    const cells = [
      { id: "a" },
      { id: "b" },
    ];
    const result = previousCellIds(cells, "z");
    expect(result).toEqual([]);
  });

  it("returns all cells except last when currentCellId is last", () => {
    const cells = [
      { id: "a" },
      { id: "b" },
      { id: "c" },
    ];
    const result = previousCellIds(cells, "c");
    expect(result).toEqual(["a", "b"]);
  });

  it("handles single cell array", () => {
    const cells = [{ id: "only" }];
    const result = previousCellIds(cells, "only");
    expect(result).toEqual([]);
  });

  it("handles cells with additional properties", () => {
    const cells = [
      { id: "a", content: "first" },
      { id: "b", content: "second" },
      { id: "c", content: "third" },
    ];
    const result = previousCellIds(cells, "c");
    expect(result).toEqual(["a", "b"]);
  });
});

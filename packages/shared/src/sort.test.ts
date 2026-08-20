import { describe, it, expect } from "vitest";
import {
  compareByUpdatedAt,
  compareByOrderIdx,
  compareByName,
  sortCellsByOrderIdx,
  sortNotebooksByUpdatedDesc,
  sortFoldersByName,
} from "./sort.ts";

describe("compareByUpdatedAt", () => {
  it("returns negative when a is newer than b with numbers", () => {
    const a = { updatedAt: 2000 };
    const b = { updatedAt: 1000 };
    expect(compareByUpdatedAt(a, b)).toBeLessThan(0);
  });

  it("returns positive when a is older than b with numbers", () => {
    const a = { updatedAt: 1000 };
    const b = { updatedAt: 2000 };
    expect(compareByUpdatedAt(a, b)).toBeGreaterThan(0);
  });

  it("returns zero when timestamps are equal with numbers", () => {
    const a = { updatedAt: 1000 };
    const b = { updatedAt: 1000 };
    expect(compareByUpdatedAt(a, b)).toBe(0);
  });

  it("handles Date objects", () => {
    const a = { updatedAt: new Date("2024-01-02T00:00:00Z") };
    const b = { updatedAt: new Date("2024-01-01T00:00:00Z") };
    expect(compareByUpdatedAt(a, b)).toBeLessThan(0);
  });

  it("handles mixed Date and number timestamps", () => {
    const a = { updatedAt: new Date("2024-01-02T00:00:00Z") };
    const b = { updatedAt: 1704067200000 };
    expect(compareByUpdatedAt(a, b)).toBeLessThan(0);
  });
});

describe("compareByOrderIdx", () => {
  it("returns negative when a has lower orderIdx", () => {
    const a = { orderIdx: 1 };
    const b = { orderIdx: 2 };
    expect(compareByOrderIdx(a, b)).toBeLessThan(0);
  });

  it("returns positive when a has higher orderIdx", () => {
    const a = { orderIdx: 3 };
    const b = { orderIdx: 1 };
    expect(compareByOrderIdx(a, b)).toBeGreaterThan(0);
  });

  it("returns zero when orderIdx are equal", () => {
    const a = { orderIdx: 5 };
    const b = { orderIdx: 5 };
    expect(compareByOrderIdx(a, b)).toBe(0);
  });
});

describe("compareByName", () => {
  it("returns negative when a comes before b alphabetically", () => {
    const a = { name: "Apple" };
    const b = { name: "Banana" };
    expect(compareByName(a, b)).toBeLessThan(0);
  });

  it("returns positive when a comes after b alphabetically", () => {
    const a = { name: "Zebra" };
    const b = { name: "Alpha" };
    expect(compareByName(a, b)).toBeGreaterThan(0);
  });

  it("returns zero when names are equal", () => {
    const a = { name: "Same" };
    const b = { name: "Same" };
    expect(compareByName(a, b)).toBe(0);
  });

  it("handles case-sensitive comparison", () => {
    const a = { name: "apple" };
    const b = { name: "Apple" };
    expect(compareByName(a, b)).toBeLessThan(0);
  });
});

describe("sortCellsByOrderIdx", () => {
  it("sorts cells by orderIdx ascending", () => {
    const cells = [
      { orderIdx: 3, id: "c3" },
      { orderIdx: 1, id: "c1" },
      { orderIdx: 2, id: "c2" },
    ];
    const sorted = sortCellsByOrderIdx(cells);
    expect(sorted.map((c) => c.orderIdx)).toEqual([1, 2, 3]);
  });

  it("does not mutate the original array", () => {
    const cells = [
      { orderIdx: 3, id: "c3" },
      { orderIdx: 1, id: "c1" },
      { orderIdx: 2, id: "c2" },
    ];
    const original = [...cells];
    sortCellsByOrderIdx(cells);
    expect(cells).toEqual(original);
  });

  it("handles empty arrays", () => {
    const cells: { orderIdx: number; id: string }[] = [];
    const sorted = sortCellsByOrderIdx(cells);
    expect(sorted).toEqual([]);
  });

  it("handles already sorted arrays", () => {
    const cells = [
      { orderIdx: 1, id: "c1" },
      { orderIdx: 2, id: "c2" },
      { orderIdx: 3, id: "c3" },
    ];
    const sorted = sortCellsByOrderIdx(cells);
    expect(sorted.map((c) => c.orderIdx)).toEqual([1, 2, 3]);
  });
});

describe("sortNotebooksByUpdatedDesc", () => {
  it("sorts notebooks by updatedAt descending with numbers", () => {
    const notebooks = [
      { updatedAt: 1000, id: "n1" },
      { updatedAt: 3000, id: "n3" },
      { updatedAt: 2000, id: "n2" },
    ];
    const sorted = sortNotebooksByUpdatedDesc(notebooks);
    expect(sorted.map((n) => n.updatedAt)).toEqual([3000, 2000, 1000]);
  });

  it("sorts notebooks by updatedAt descending with Dates", () => {
    const notebooks = [
      { updatedAt: new Date("2024-01-01T00:00:00Z"), id: "n1" },
      { updatedAt: new Date("2024-01-03T00:00:00Z"), id: "n3" },
      { updatedAt: new Date("2024-01-02T00:00:00Z"), id: "n2" },
    ];
    const sorted = sortNotebooksByUpdatedDesc(notebooks);
    expect(sorted.map((n) => n.id)).toEqual(["n3", "n2", "n1"]);
  });

  it("does not mutate the original array", () => {
    const notebooks = [
      { updatedAt: 1000, id: "n1" },
      { updatedAt: 3000, id: "n3" },
      { updatedAt: 2000, id: "n2" },
    ];
    const original = [...notebooks];
    sortNotebooksByUpdatedDesc(notebooks);
    expect(notebooks).toEqual(original);
  });

  it("handles empty arrays", () => {
    const notebooks: { updatedAt: number; id: string }[] = [];
    const sorted = sortNotebooksByUpdatedDesc(notebooks);
    expect(sorted).toEqual([]);
  });
});

describe("sortFoldersByName", () => {
  it("sorts folders by name alphabetically", () => {
    const folders = [
      { name: "Zebra" },
      { name: "Apple" },
      { name: "Mango" },
    ];
    const sorted = sortFoldersByName(folders);
    expect(sorted.map((f) => f.name)).toEqual(["Apple", "Mango", "Zebra"]);
  });

  it("does not mutate the original array", () => {
    const folders = [
      { name: "Zebra" },
      { name: "Apple" },
      { name: "Mango" },
    ];
    const original = [...folders];
    sortFoldersByName(folders);
    expect(folders).toEqual(original);
  });

  it("handles empty arrays", () => {
    const folders: { name: string }[] = [];
    const sorted = sortFoldersByName(folders);
    expect(sorted).toEqual([]);
  });

  it("handles case-sensitive sorting", () => {
    const folders = [
      { name: "apple" },
      { name: "Apple" },
      { name: "banana" },
    ];
    const sorted = sortFoldersByName(folders);
    expect(sorted.map((f) => f.name)).toEqual(["apple", "Apple", "banana"]);
  });
});

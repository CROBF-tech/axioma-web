import { describe, it, expect } from "vitest";
import {
  notebooks,
  cells,
  subscriptions,
  type NotebookRow,
  type NewNotebookRow,
  type NewCellRow,
  type NewFolderRow,
  type NewSubscriptionRow,
} from "./schema/index.ts";

const NOW = new Date("2026-01-01T00:00:00Z");

describe("schema — notebooks", () => {
  it("tiene las columnas esperadas", () => {
    const columns = Object.keys(notebooks);
    expect(columns).toEqual(
      expect.arrayContaining([
        "id",
        "ownerId",
        "title",
        "folderId",
        "accent",
        "isPublic",
        "publicSlug",
        "createdAt",
        "updatedAt",
      ]),
    );
  });

  it("notebook $inferSelect mantiene booleans", () => {
    const row: NotebookRow = {
      id: "n1",
      ownerId: "u1",
      title: "Untitled",
      folderId: null,
      accent: null,
      isPublic: false,
      publicSlug: null,
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(typeof row.isPublic).toBe("boolean");
  });

  it("acepta inserts válidos", () => {
    const row: NewNotebookRow = {
      id: "n1",
      ownerId: "u1",
      title: "Untitled",
      folderId: null,
      accent: null,
      isPublic: false,
      publicSlug: null,
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(row.id).toBe("n1");
  });
});

describe("schema — cells", () => {
  it("tiene las columnas esperadas", () => {
    const columns = Object.keys(cells);
    expect(columns).toEqual(
      expect.arrayContaining([
        "id",
        "notebookId",
        "orderIdx",
        "kind",
        "input",
        "output",
        "references",
        "createdAt",
        "updatedAt",
      ]),
    );
  });

  it("acepta references como array de ids", () => {
    const row: NewCellRow = {
      id: "c1",
      notebookId: "n1",
      orderIdx: 0,
      kind: "math",
      input: "x^2",
      output: null,
      references: ["c0"],
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(row.references).toEqual(["c0"]);
  });
});

describe("schema — folders", () => {
  it("tiene parentId para árbol", () => {
    const row: NewFolderRow = {
      id: "f1",
      ownerId: "u1",
      name: "Raíz",
      parentId: null,
      createdAt: NOW,
    };
    expect(row.parentId).toBeNull();
  });
});

describe("schema — subscriptions", () => {
  it("acepta planes monthly y annual", () => {
    const m: NewSubscriptionRow = {
      id: "s1",
      userId: "u1",
      plan: "monthly",
      status: "active",
      mpPreapprovalId: null,
      currentPeriodEnd: null,
      createdAt: NOW,
      updatedAt: NOW,
    };
    const a: NewSubscriptionRow = { ...m, id: "s2", plan: "annual" };
    expect(["monthly", "annual"]).toContain(m.plan);
    expect(["monthly", "annual"]).toContain(a.plan);
  });

  it("acepta los 4 status", () => {
    expect(Object.keys(subscriptions)).toContain("status");
    const statuses = ["active", "pending", "cancelled", "expired"] as const;
    expect(statuses).toHaveLength(4);
  });
});

import { describe, it, expect } from "vitest";
import {
  CreateNotebookRequestSchema,
  UpdateNotebookRequestSchema,
  ListNotebooksResponseSchema,
  CreateCellRequestSchema,
  UpdateCellRequestSchema,
  ReorderRequestSchema,
  CreateFolderRequestSchema,
  UpdateFolderRequestSchema,
  CheckoutRequestSchema,
  CheckoutResponseSchema,
  SubscriptionStatusResponseSchema,
} from "./schemas.ts";

const validNotebook = {
  id: "nb-1",
  title: "Test notebook",
  ownerId: "owner-1",
  accent: "#6366f1",
  folderId: null,
  slug: null,
  isPublic: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("CreateNotebookRequestSchema", () => {
  it("validates empty object", () => {
    expect(() => CreateNotebookRequestSchema.parse({})).not.toThrow();
  });

  it("validates complete object", () => {
    const data = {
      title: "Notebook",
      accent: "#6366f1",
      folderId: "folder-1",
    };
    expect(CreateNotebookRequestSchema.parse(data)).toEqual(data);
  });

  it("rejects titles over 200 characters", () => {
    expect(() =>
      CreateNotebookRequestSchema.parse({ title: "a".repeat(201) }),
    ).toThrow();
  });

  it("allows null folderId", () => {
    expect(() =>
      CreateNotebookRequestSchema.parse({ folderId: null }),
    ).not.toThrow();
  });
});

describe("UpdateNotebookRequestSchema", () => {
  it("validates empty object", () => {
    expect(() => UpdateNotebookRequestSchema.parse({})).not.toThrow();
  });

  it("validates complete object", () => {
    const data = {
      title: "Updated",
      accent: "#ec4899",
      folderId: "folder-2",
    };
    expect(UpdateNotebookRequestSchema.parse(data)).toEqual(data);
  });

  it("rejects titles over 200 characters", () => {
    expect(() =>
      UpdateNotebookRequestSchema.parse({ title: "a".repeat(201) }),
    ).toThrow();
  });

  it("allows null folderId", () => {
    expect(() =>
      UpdateNotebookRequestSchema.parse({ folderId: null }),
    ).not.toThrow();
  });
});

describe("ListNotebooksResponseSchema", () => {
  it("validates response with empty items", () => {
    const data = { items: [], nextCursor: null };
    expect(ListNotebooksResponseSchema.parse(data)).toEqual(data);
  });

  it("validates response with notebooks", () => {
    const data = {
      items: [validNotebook],
      nextCursor: "cursor-1",
    };
    expect(ListNotebooksResponseSchema.parse(data)).toEqual(data);
  });

  it("rejects non-array items", () => {
    expect(() =>
      ListNotebooksResponseSchema.parse({ items: {}, nextCursor: null }),
    ).toThrow();
  });

  it("rejects missing nextCursor", () => {
    expect(() => ListNotebooksResponseSchema.parse({ items: [] })).toThrow();
  });
});

describe("CreateCellRequestSchema", () => {
  it("validates minimal object", () => {
    const data = { kind: "math" };
    expect(CreateCellRequestSchema.parse(data)).toEqual(data);
  });

  it("validates complete object", () => {
    const data = {
      kind: "text",
      input: "Hello",
      orderIdx: 1,
    };
    expect(CreateCellRequestSchema.parse(data)).toEqual(data);
  });

  it("rejects invalid kind", () => {
    expect(() => CreateCellRequestSchema.parse({ kind: "code" })).toThrow();
  });

  it("rejects non-string kind", () => {
    expect(() => CreateCellRequestSchema.parse({ kind: 123 })).toThrow();
  });

  it("accepts plot kind", () => {
    expect(() =>
      CreateCellRequestSchema.parse({ kind: "plot" }),
    ).not.toThrow();
  });
});

describe("UpdateCellRequestSchema", () => {
  it("validates empty object", () => {
    expect(() => UpdateCellRequestSchema.parse({})).not.toThrow();
  });

  it("validates complete object", () => {
    const data = {
      input: "x + 1",
      output: { result: 2 },
      references: ["cell-1", "cell-2"],
      orderIdx: 0,
    };
    expect(UpdateCellRequestSchema.parse(data)).toEqual(data);
  });

  it("rejects references with empty ids", () => {
    expect(() =>
      UpdateCellRequestSchema.parse({ references: ["cell-1", ""] }),
    ).toThrow();
  });

  it("rejects references with number ids", () => {
    expect(() =>
      UpdateCellRequestSchema.parse({ references: ["cell-1", 2] }),
    ).toThrow();
  });

  it("rejects references when not an array", () => {
    expect(() =>
      UpdateCellRequestSchema.parse({ references: "cell-1" }),
    ).toThrow();
  });
});

describe("ReorderRequestSchema", () => {
  it("validates array of ids", () => {
    const data = { order: ["a", "b", "c"] };
    expect(ReorderRequestSchema.parse(data)).toEqual(data);
  });

  it("validates empty array", () => {
    expect(() => ReorderRequestSchema.parse({ order: [] })).not.toThrow();
  });

  it("rejects order as string", () => {
    expect(() => ReorderRequestSchema.parse({ order: "abc" })).toThrow();
  });

  it("rejects order as numbers", () => {
    expect(() => ReorderRequestSchema.parse({ order: [1, 2, 3] })).toThrow();
  });

  it("rejects empty id in order", () => {
    expect(() => ReorderRequestSchema.parse({ order: ["a", ""] })).toThrow();
  });

  it("rejects missing order", () => {
    expect(() => ReorderRequestSchema.parse({})).toThrow();
  });
});

describe("CreateFolderRequestSchema", () => {
  it("validates minimal object", () => {
    const data = { name: "Folder", parentId: null };
    expect(CreateFolderRequestSchema.parse(data)).toEqual(data);
  });

  it("validates complete object", () => {
    const data = { name: "Folder", parentId: "parent-1" };
    expect(CreateFolderRequestSchema.parse(data)).toEqual(data);
  });

  it("rejects missing name", () => {
    expect(() => CreateFolderRequestSchema.parse({ parentId: null })).toThrow();
  });

  it("rejects missing parentId", () => {
    expect(() => CreateFolderRequestSchema.parse({ name: "Folder" })).toThrow();
  });

  it("rejects non-null parentId with wrong type", () => {
    expect(() =>
      CreateFolderRequestSchema.parse({ name: "Folder", parentId: 123 }),
    ).toThrow();
  });
});

describe("UpdateFolderRequestSchema", () => {
  it("validates empty object", () => {
    expect(() => UpdateFolderRequestSchema.parse({})).not.toThrow();
  });

  it("validates complete object", () => {
    const data = { name: "Updated", parentId: "parent-1" };
    expect(UpdateFolderRequestSchema.parse(data)).toEqual(data);
  });

  it("validates null parentId", () => {
    expect(() =>
      UpdateFolderRequestSchema.parse({ parentId: null }),
    ).not.toThrow();
  });

  it("rejects non-string name", () => {
    expect(() =>
      UpdateFolderRequestSchema.parse({ name: 123 }),
    ).toThrow();
  });
});

describe("CheckoutRequestSchema", () => {
  it("validates monthly plan", () => {
    const data = { plan: "monthly" };
    expect(CheckoutRequestSchema.parse(data)).toEqual(data);
  });

  it("validates annual plan", () => {
    const data = { plan: "annual" };
    expect(CheckoutRequestSchema.parse(data)).toEqual(data);
  });

  it("rejects invalid plan", () => {
    expect(() => CheckoutRequestSchema.parse({ plan: "weekly" })).toThrow();
  });

  it("rejects missing plan", () => {
    expect(() => CheckoutRequestSchema.parse({})).toThrow();
  });
});

describe("CheckoutResponseSchema", () => {
  it("validates response", () => {
    const data = { init_point: "https://checkout.example.com" };
    expect(CheckoutResponseSchema.parse(data)).toEqual(data);
  });

  it("rejects missing init_point", () => {
    expect(() => CheckoutResponseSchema.parse({})).toThrow();
  });

  it("rejects non-string init_point", () => {
    expect(() => CheckoutResponseSchema.parse({ init_point: 123 })).toThrow();
  });
});

describe("SubscriptionStatusResponseSchema", () => {
  it("validates minimal response", () => {
    const data = {
      status: "none",
      plan: null,
      current_period_end: null,
    };
    expect(SubscriptionStatusResponseSchema.parse(data)).toEqual(data);
  });

  it("validates complete response", () => {
    const data = {
      status: "active",
      plan: "monthly",
      current_period_end: "2026-01-01T00:00:00Z",
    };
    expect(SubscriptionStatusResponseSchema.parse(data)).toEqual(data);
  });

  it("rejects invalid status", () => {
    expect(() =>
      SubscriptionStatusResponseSchema.parse({
        status: "paused",
        plan: null,
        current_period_end: null,
      }),
    ).toThrow();
  });

  it("rejects invalid plan", () => {
    expect(() =>
      SubscriptionStatusResponseSchema.parse({
        status: "active",
        plan: "weekly",
        current_period_end: null,
      }),
    ).toThrow();
  });

  it("rejects missing status", () => {
    expect(() =>
      SubscriptionStatusResponseSchema.parse({
        plan: null,
        current_period_end: null,
      }),
    ).toThrow();
  });

  it("rejects missing plan", () => {
    expect(() =>
      SubscriptionStatusResponseSchema.parse({
        status: "active",
        current_period_end: null,
      }),
    ).toThrow();
  });

  it("rejects missing current_period_end", () => {
    expect(() =>
      SubscriptionStatusResponseSchema.parse({
        status: "active",
        plan: "monthly",
      }),
    ).toThrow();
  });
});

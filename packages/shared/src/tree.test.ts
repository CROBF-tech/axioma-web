import { describe, it, expect } from "vitest";
import {
  buildFolderTree,
  flattenFolderTree,
  getFolderChildren,
  getFolderAncestors,
  isFolderDescendant,
  notebooksInFolder,
} from "./tree.ts";

describe("buildFolderTree", () => {
  it("returns empty array for empty input", () => {
    const folders: Array<{ id: string; parentId?: string | null }> = [];
    const result = buildFolderTree(folders);
    expect(result).toEqual([]);
  });

  it("builds tree with single root folder", () => {
    const folders = [{ id: "root", parentId: null }];
    const result = buildFolderTree(folders);
    expect(result).toHaveLength(1);
    expect(result[0].folder.id).toBe("root");
    expect(result[0].children).toEqual([]);
  });

  it("builds tree with one level of children", () => {
    const folders = [
      { id: "root", parentId: null },
      { id: "child1", parentId: "root" },
      { id: "child2", parentId: "root" },
    ];
    const result = buildFolderTree(folders);
    expect(result).toHaveLength(1);
    expect(result[0].folder.id).toBe("root");
    expect(result[0].children.map((c) => c.folder.id)).toEqual(["child1", "child2"]);
  });

  it("builds tree with two levels of children", () => {
    const folders = [
      { id: "root", parentId: null },
      { id: "child1", parentId: "root" },
      { id: "grandchild1", parentId: "child1" },
      { id: "child2", parentId: "root" },
    ];
    const result = buildFolderTree(folders);
    expect(result).toHaveLength(1);
    expect(result[0].folder.id).toBe("root");
    expect(result[0].children).toHaveLength(2);
    const child1Node = result[0].children.find((c) => c.folder.id === "child1");
    expect(child1Node).toBeDefined();
    expect(child1Node?.children.map((c) => c.folder.id)).toEqual(["grandchild1"]);
  });

  it("handles folders in reverse order (children before parents)", () => {
    const folders = [
      { id: "grandchild", parentId: "child" },
      { id: "child", parentId: "root" },
      { id: "root", parentId: null },
    ];
    const result = buildFolderTree(folders);
    expect(result).toHaveLength(1);
    expect(result[0].folder.id).toBe("root");
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children[0].folder.id).toBe("child");
    expect(result[0].children[0].children.map((c) => c.folder.id)).toEqual(["grandchild"]);
  });

  it("handles multiple root folders", () => {
    const folders = [
      { id: "root1", parentId: null },
      { id: "root2", parentId: null },
      { id: "child1", parentId: "root1" },
      { id: "child2", parentId: "root2" },
    ];
    const result = buildFolderTree(folders);
    expect(result).toHaveLength(2);
    const rootIds = result.map((r) => r.folder.id).sort();
    expect(rootIds).toEqual(["root1", "root2"]);
  });

  it("handles folders with undefined parentId as roots", () => {
    const folders = [
      { id: "folder1" },
      { id: "folder2", parentId: undefined },
    ];
    const result = buildFolderTree(folders);
    expect(result).toHaveLength(2);
  });

  it("preserves folder properties in tree nodes", () => {
    const folders = [
      { id: "root", parentId: null, name: "Root Folder" },
      { id: "child", parentId: "root", name: "Child Folder" },
    ];
    const result = buildFolderTree(folders);
    expect(result[0].folder.name).toBe("Root Folder");
    expect(result[0].children[0].folder.name).toBe("Child Folder");
  });
});

describe("flattenFolderTree", () => {
  it("returns empty array for empty tree", () => {
    const nodes: Array<{ folder: { id: string }; children: unknown[] }> = [];
    const result = flattenFolderTree(nodes);
    expect(result).toEqual([]);
  });

  it("flattens single node tree", () => {
    const nodes = [{ folder: { id: "root" }, children: [] }];
    const result = flattenFolderTree(nodes);
    expect(result.map((f) => f.id)).toEqual(["root"]);
  });

  it("flattens tree in pre-order (root, then children)", () => {
    const nodes = [
      {
        folder: { id: "root" },
        children: [
          { folder: { id: "child1" }, children: [] },
          { folder: { id: "child2" }, children: [] },
        ],
      },
    ];
    const result = flattenFolderTree(nodes);
    expect(result.map((f) => f.id)).toEqual(["root", "child1", "child2"]);
  });

  it("flattens nested tree in pre-order", () => {
    const nodes = [
      {
        folder: { id: "root" },
        children: [
          {
            folder: { id: "child1" },
            children: [{ folder: { id: "grandchild1" }, children: [] }],
          },
          { folder: { id: "child2" }, children: [] },
        ],
      },
    ];
    const result = flattenFolderTree(nodes);
    expect(result.map((f) => f.id)).toEqual(["root", "child1", "grandchild1", "child2"]);
  });

  it("flattens multiple root trees", () => {
    const nodes = [
      { folder: { id: "root1" }, children: [] },
      { folder: { id: "root2" }, children: [] },
    ];
    const result = flattenFolderTree(nodes);
    expect(result.map((f) => f.id)).toEqual(["root1", "root2"]);
  });
});

describe("getFolderChildren", () => {
  it("returns empty array when no children exist", () => {
    const folders = [
      { id: "root", parentId: null },
      { id: "other", parentId: null },
    ];
    const result = getFolderChildren(folders, "root");
    expect(result).toEqual([]);
  });

  it("returns direct children of folder", () => {
    const folders = [
      { id: "root", parentId: null },
      { id: "child1", parentId: "root" },
      { id: "child2", parentId: "root" },
      { id: "grandchild", parentId: "child1" },
    ];
    const result = getFolderChildren(folders, "root");
    expect(result.map((f) => f.id)).toEqual(["child1", "child2"]);
  });

  it("returns empty array for null parentId when all folders have parents", () => {
    const folders = [
      { id: "child1", parentId: "root" },
      { id: "child2", parentId: "root" },
    ];
    const result = getFolderChildren(folders, null);
    expect(result).toEqual([]);
  });

  it("returns root folders when parentId is null", () => {
    const folders = [
      { id: "root1", parentId: null },
      { id: "child1", parentId: "root1" },
      { id: "root2", parentId: null },
    ];
    const result = getFolderChildren(folders, null);
    expect(result.map((f) => f.id)).toEqual(["root1", "root2"]);
  });

  it("handles folders with undefined parentId as roots", () => {
    const folders = [
      { id: "folder1", parentId: undefined },
      { id: "folder2", parentId: "folder1" },
    ];
    const result = getFolderChildren(folders, null);
    expect(result.map((f) => f.id)).toEqual(["folder1"]);
  });
});

describe("getFolderAncestors", () => {
  it("returns empty array for root folder", () => {
    const folders = [{ id: "root", parentId: null }];
    const result = getFolderAncestors(folders, "root");
    expect(result).toEqual([]);
  });

  it("returns single parent for direct child", () => {
    const folders = [
      { id: "root", parentId: null },
      { id: "child", parentId: "root" },
    ];
    const result = getFolderAncestors(folders, "child");
    expect(result.map((f) => f.id)).toEqual(["root"]);
  });

  it("returns chain of ancestors", () => {
    const folders = [
      { id: "root", parentId: null },
      { id: "child", parentId: "root" },
      { id: "grandchild", parentId: "child" },
      { id: "greatgrandchild", parentId: "grandchild" },
    ];
    const result = getFolderAncestors(folders, "greatgrandchild");
    expect(result.map((f) => f.id)).toEqual(["grandchild", "child", "root"]);
  });

  it("returns empty array for non-existent folder", () => {
    const folders = [{ id: "root", parentId: null }];
    const result = getFolderAncestors(folders, "nonexistent");
    expect(result).toEqual([]);
  });

  it("stops at root folder", () => {
    const folders = [
      { id: "root", parentId: null },
      { id: "child", parentId: "root" },
    ];
    const result = getFolderAncestors(folders, "child");
    expect(result.map((f) => f.id)).toEqual(["root"]);
  });

  it("handles circular parent references safely", () => {
    const folders = [
      { id: "a", parentId: "b" as string },
      { id: "b", parentId: "a" as string },
    ];
    const result = getFolderAncestors(folders, "a");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("b");
  });
});

describe("isFolderDescendant", () => {
  it("returns true for direct child", () => {
    const folders = [
      { id: "root", parentId: null },
      { id: "child", parentId: "root" },
    ];
    expect(isFolderDescendant(folders, "child", "root")).toBe(true);
  });

  it("returns true for grandchild", () => {
    const folders = [
      { id: "root", parentId: null },
      { id: "child", parentId: "root" },
      { id: "grandchild", parentId: "child" },
    ];
    expect(isFolderDescendant(folders, "grandchild", "root")).toBe(true);
  });

  it("returns false for parent", () => {
    const folders = [
      { id: "root", parentId: null },
      { id: "child", parentId: "root" },
    ];
    expect(isFolderDescendant(folders, "root", "child")).toBe(false);
  });

  it("returns false for sibling", () => {
    const folders = [
      { id: "root", parentId: null },
      { id: "child1", parentId: "root" },
      { id: "child2", parentId: "root" },
    ];
    expect(isFolderDescendant(folders, "child1", "child2")).toBe(false);
  });

  it("returns false for same folder", () => {
    const folders = [{ id: "root", parentId: null }];
    expect(isFolderDescendant(folders, "root", "root")).toBe(false);
  });

  it("returns false for non-existent folder", () => {
    const folders = [{ id: "root", parentId: null }];
    expect(isFolderDescendant(folders, "nonexistent", "root")).toBe(false);
  });
});

describe("notebooksInFolder", () => {
  it("returns empty array when no notebooks match", () => {
    const notebooks = [
      { id: "n1", folderId: "folder1" },
      { id: "n2", folderId: "folder2" },
    ];
    const result = notebooksInFolder(notebooks, "folder3");
    expect(result).toEqual([]);
  });

  it("returns notebooks in specified folder", () => {
    const notebooks = [
      { id: "n1", folderId: "folder1" },
      { id: "n2", folderId: "folder2" },
      { id: "n3", folderId: "folder1" },
    ];
    const result = notebooksInFolder(notebooks, "folder1");
    expect(result.map((n) => n.id)).toEqual(["n1", "n3"]);
  });

  it("returns notebooks with null folderId when folderId is null", () => {
    const notebooks = [
      { id: "n1", folderId: null },
      { id: "n2", folderId: "folder1" },
      { id: "n3", folderId: null },
    ];
    const result = notebooksInFolder(notebooks, null);
    expect(result.map((n) => n.id)).toEqual(["n1", "n3"]);
  });

  it("returns notebooks with undefined folderId when folderId is null", () => {
    const notebooks = [
      { id: "n1", folderId: undefined },
      { id: "n2", folderId: "folder1" },
      { id: "n3" },
    ];
    const result = notebooksInFolder(notebooks, null);
    expect(result.map((n) => n.id)).toEqual(["n1", "n3"]);
  });

  it("returns empty array for empty notebooks list", () => {
    const notebooks: Array<{ id: string; folderId?: string | null }> = [];
    const result = notebooksInFolder(notebooks, "folder1");
    expect(result).toEqual([]);
  });

  it("preserves notebook properties in result", () => {
    const notebooks = [
      { id: "n1", folderId: "folder1", title: "Notebook 1" },
      { id: "n2", folderId: "folder1", title: "Notebook 2" },
    ];
    const result = notebooksInFolder(notebooks, "folder1");
    expect(result.map((n) => n.title)).toEqual(["Notebook 1", "Notebook 2"]);
  });
});

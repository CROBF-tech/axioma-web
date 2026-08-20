import { describe, it, expect } from "vitest";
import { notebookPath, publicNotebookPath, isPublicNotebook } from "./notebook.ts";

describe("notebookPath", () => {
  it("returns path with correct format", () => {
    expect(notebookPath("123")).toBe("/notebooks/123");
  });

  it("handles uuid-style ids", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    expect(notebookPath(id)).toBe(`/notebooks/${id}`);
  });

  it("handles numeric string ids", () => {
    expect(notebookPath("1")).toBe("/notebooks/1");
    expect(notebookPath("999999")).toBe("/notebooks/999999");
  });

  it("handles ids with special characters", () => {
    expect(notebookPath("abc-123_def")).toBe("/notebooks/abc-123_def");
  });
});

describe("publicNotebookPath", () => {
  it("returns path with correct format", () => {
    expect(publicNotebookPath("abcdefghijklmnopqrstuv")).toBe("/s/abcdefghijklmnopqrstuv");
  });

  it("handles slugs with mixed case", () => {
    expect(publicNotebookPath("AbCdEfGhIjKlMnOpQrStUv")).toBe("/s/AbCdEfGhIjKlMnOpQrStUv");
  });

  it("handles slugs with digits", () => {
    expect(publicNotebookPath("0123456789abcdefghijKL")).toBe("/s/0123456789abcdefghijKL");
  });

  it("handles empty slug", () => {
    expect(publicNotebookPath("")).toBe("/s/");
  });
});

describe("isPublicNotebook", () => {
  it("returns true when isPublic is true and publicSlug is a non-empty string", () => {
    const notebook = { isPublic: true, publicSlug: "abcdefghijklmnopqrstuv" };
    expect(isPublicNotebook(notebook)).toBe(true);
  });

  it("returns false when isPublic is false", () => {
    const notebook = { isPublic: false, publicSlug: "abcdefghijklmnopqrstuv" };
    expect(isPublicNotebook(notebook)).toBe(false);
  });

  it("returns false when isPublic is true but publicSlug is null", () => {
    const notebook = { isPublic: true, publicSlug: null };
    expect(isPublicNotebook(notebook)).toBe(false);
  });

  it("returns false when isPublic is true but publicSlug is undefined", () => {
    const notebook = { isPublic: true, publicSlug: undefined };
    expect(isPublicNotebook(notebook)).toBe(false);
  });

  it("returns false when isPublic is true but publicSlug is empty string", () => {
    const notebook = { isPublic: true, publicSlug: "" };
    expect(isPublicNotebook(notebook)).toBe(false);
  });

  it("returns false when publicSlug property is missing", () => {
    const notebook = { isPublic: true };
    expect(isPublicNotebook(notebook as { isPublic: boolean; publicSlug?: string })).toBe(false);
  });

  it("returns false when isPublic is false and publicSlug is null", () => {
    const notebook = { isPublic: false, publicSlug: null };
    expect(isPublicNotebook(notebook)).toBe(false);
  });

  it("returns false when isPublic is false and publicSlug is undefined", () => {
    const notebook = { isPublic: false, publicSlug: undefined };
    expect(isPublicNotebook(notebook)).toBe(false);
  });

  it("handles notebook with additional properties", () => {
    const notebook = {
      id: "123",
      title: "My Notebook",
      isPublic: true,
      publicSlug: "abcdefghijklmnopqrstuv",
    };
    expect(isPublicNotebook(notebook)).toBe(true);
  });
});

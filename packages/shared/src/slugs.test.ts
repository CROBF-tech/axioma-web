import { describe, it, expect } from "vitest";
import { generatePublicSlug, buildPublicNotebookPath, buildPublicNotebookUrl } from "./slugs.ts";
import { PUBLIC_SLUG_ALPHABET, PUBLIC_SLUG_MIN_LENGTH } from "./constants.ts";

describe("generatePublicSlug", () => {
  it("returns a string of correct length", () => {
    const slug = generatePublicSlug();
    expect(slug).toHaveLength(PUBLIC_SLUG_MIN_LENGTH);
  });

  it("uses only characters from the allowed alphabet", () => {
    const slug = generatePublicSlug();
    for (const char of slug) {
      expect(PUBLIC_SLUG_ALPHABET).toContain(char);
    }
  });

  it("generates different slugs on each call", () => {
    const slugs = new Set<string>();
    for (let i = 0; i < 100; i++) {
      slugs.add(generatePublicSlug());
    }
    expect(slugs.size).toBeGreaterThan(1);
  });

  it("generates slugs with mixed case letters and digits", () => {
    const slugs: string[] = [];
    for (let i = 0; i < 10; i++) {
      slugs.push(generatePublicSlug());
    }
    const allChars = slugs.join("");
    const hasDigit = /[0-9]/.test(allChars);
    const hasLower = /[a-z]/.test(allChars);
    const hasUpper = /[A-Z]/.test(allChars);
    expect(hasDigit).toBe(true);
    expect(hasLower).toBe(true);
    expect(hasUpper).toBe(true);
  });
});

describe("buildPublicNotebookPath", () => {
  it("returns path with correct format", () => {
    const slug = "abcdefghijklmnopqrstuv";
    expect(buildPublicNotebookPath(slug)).toBe("/s/abcdefghijklmnopqrstuv");
  });

  it("handles slugs with special characters from alphabet", () => {
    const slug = "0123456789ABCDEFGHIJKL";
    expect(buildPublicNotebookPath(slug)).toBe("/s/0123456789ABCDEFGHIJKL");
  });

  it("handles empty slug", () => {
    expect(buildPublicNotebookPath("")).toBe("/s/");
  });
});

describe("buildPublicNotebookUrl", () => {
  it("builds URL without trailing slash in origin", () => {
    const slug = "abcdefghijklmnopqrstuv";
    const origin = "https://example.com";
    expect(buildPublicNotebookUrl(slug, origin)).toBe("https://example.com/s/abcdefghijklmnopqrstuv");
  });

  it("removes trailing slash from origin", () => {
    const slug = "abcdefghijklmnopqrstuv";
    const origin = "https://example.com/";
    expect(buildPublicNotebookUrl(slug, origin)).toBe("https://example.com/s/abcdefghijklmnopqrstuv");
  });

  it("handles origin with multiple trailing slashes", () => {
    const slug = "abcdefghijklmnopqrstuv";
    const origin = "https://example.com//";
    expect(buildPublicNotebookUrl(slug, origin)).toBe("https://example.com//s/abcdefghijklmnopqrstuv");
  });

  it("handles localhost origin", () => {
    const slug = "testSlug12345678901234";
    const origin = "http://localhost:3000";
    expect(buildPublicNotebookUrl(slug, origin)).toBe("http://localhost:3000/s/testSlug12345678901234");
  });

  it("handles localhost origin with trailing slash", () => {
    const slug = "testSlug12345678901234";
    const origin = "http://localhost:3000/";
    expect(buildPublicNotebookUrl(slug, origin)).toBe("http://localhost:3000/s/testSlug12345678901234");
  });
});

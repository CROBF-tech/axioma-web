import { describe, it, expect } from "vitest";
import { matchShortcut, formatShortcutLabel } from "./keyboard.ts";

describe("matchShortcut", () => {
  it("returns null for non-notebook contexts", () => {
    const input = { key: "Enter", ctrlKey: true, metaKey: false, shiftKey: false, altKey: false };
    expect(matchShortcut(input, "math-input")).toBe(null);
    expect(matchShortcut(input, "global")).toBe(null);
  });

  it("matches run-cell with ctrl", () => {
    const input = { key: "Enter", ctrlKey: true, metaKey: false, shiftKey: false, altKey: false };
    expect(matchShortcut(input, "notebook")).toBe("run-cell");
  });

  it("matches run-cell with meta", () => {
    const input = { key: "Enter", ctrlKey: false, metaKey: true, shiftKey: false, altKey: false };
    expect(matchShortcut(input, "notebook")).toBe("run-cell");
  });

  it("does not match run-cell without ctrl/meta", () => {
    const input = { key: "Enter", ctrlKey: false, metaKey: false, shiftKey: false, altKey: false };
    expect(matchShortcut(input, "notebook")).toBe(null);
  });

  it("matches next-cell", () => {
    const input = { key: "ArrowDown", ctrlKey: false, metaKey: false, shiftKey: false, altKey: false };
    expect(matchShortcut(input, "notebook")).toBe("next-cell");
  });

  it("matches prev-cell", () => {
    const input = { key: "ArrowUp", ctrlKey: false, metaKey: false, shiftKey: false, altKey: false };
    expect(matchShortcut(input, "notebook")).toBe("prev-cell");
  });

  it("matches blur-input", () => {
    const input = { key: "Escape", ctrlKey: false, metaKey: false, shiftKey: false, altKey: false };
    expect(matchShortcut(input, "notebook")).toBe("blur-input");
  });

  it("returns null for unmatched keys in notebook context", () => {
    const input = { key: "a", ctrlKey: false, metaKey: false, shiftKey: false, altKey: false };
    expect(matchShortcut(input, "notebook")).toBe(null);
  });
});

describe("formatShortcutLabel", () => {
  it("formats command key on mac", () => {
    expect(formatShortcutLabel({ key: "Enter", ctrlOrCmd: true }, "mac")).toBe("⌘+Enter");
  });

  it("formats control key on win", () => {
    expect(formatShortcutLabel({ key: "Enter", ctrlOrCmd: true }, "win")).toBe("Ctrl+Enter");
  });

  it("formats shift on mac", () => {
    expect(formatShortcutLabel({ key: "Enter", ctrlOrCmd: false, shift: true }, "mac")).toBe("⇧+Enter");
  });

  it("formats shift on win", () => {
    expect(formatShortcutLabel({ key: "Enter", ctrlOrCmd: false, shift: true }, "win")).toBe("Shift+Enter");
  });

  it("formats alt on mac", () => {
    expect(formatShortcutLabel({ key: "Enter", ctrlOrCmd: false, alt: true }, "mac")).toBe("⌥+Enter");
  });

  it("formats alt on win", () => {
    expect(formatShortcutLabel({ key: "Enter", ctrlOrCmd: false, alt: true }, "win")).toBe("Alt+Enter");
  });

  it("formats multiple modifiers on mac", () => {
    expect(formatShortcutLabel({ key: "K", ctrlOrCmd: true, shift: true, alt: true }, "mac")).toBe("⌘+⌥+⇧+K");
  });

  it("formats multiple modifiers on win", () => {
    expect(formatShortcutLabel({ key: "K", ctrlOrCmd: true, shift: true, alt: true }, "win")).toBe("Ctrl+Alt+Shift+K");
  });

  it("formats bare key", () => {
    expect(formatShortcutLabel({ key: "Escape", ctrlOrCmd: false }, "mac")).toBe("Escape");
  });
});

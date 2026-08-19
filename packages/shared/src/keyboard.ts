import { NOTEBOOK_SHORTCUTS } from "./constants.ts";

export type ShortcutAction = "run-cell" | "next-cell" | "prev-cell" | "blur-input";

export function matchShortcut(
  input: {
    key: string;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
  },
  context: "notebook" | "math-input" | "global",
): ShortcutAction | null {
  if (context !== "notebook") return null;
  for (const sc of NOTEBOOK_SHORTCUTS) {
    const ctrlOrCmdOk = sc.ctrlOrCmd ? input.ctrlKey || input.metaKey : true;
    if (!ctrlOrCmdOk) continue;
    if (sc.key !== input.key) continue;
    return sc.action;
  }
  return null;
}

export function formatShortcutLabel(
  shortcut: { key: string; ctrlOrCmd: boolean; shift?: boolean; alt?: boolean },
  platform: "mac" | "win",
): string {
  const parts: string[] = [];
  if (shortcut.ctrlOrCmd) {
    parts.push(platform === "mac" ? "⌘" : "Ctrl");
  }
  if (shortcut.alt) {
    parts.push(platform === "mac" ? "⌥" : "Alt");
  }
  if (shortcut.shift) {
    parts.push(platform === "mac" ? "⇧" : "Shift");
  }
  parts.push(shortcut.key);
  return parts.join("+");
}
import type { CellKind, SubscriptionPlan, SubscriptionStatus } from "./index.ts";
import {
  ACCENT_PRESETS,
  CELL_KINDS,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PUBLIC_SLUG_ALPHABET,
  PUBLIC_SLUG_MIN_LENGTH,
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_STATUSES,
} from "./constants.ts";
import type { ID } from "./constants.ts";

export function isValidCellKind(value: unknown): value is CellKind {
  return typeof value === "string" && (CELL_KINDS as readonly string[]).includes(value);
}

export function isValidSubscriptionPlan(value: unknown): value is SubscriptionPlan {
  return typeof value === "string" && (SUBSCRIPTION_PLANS as readonly string[]).includes(value);
}

export function isValidSubscriptionStatus(value: unknown): value is SubscriptionStatus {
  return typeof value === "string" && (SUBSCRIPTION_STATUSES as readonly string[]).includes(value);
}

export function isValidPublicSlug(slug: string): boolean {
  if (typeof slug !== "string" || slug.length < PUBLIC_SLUG_MIN_LENGTH) return false;
  for (let i = 0; i < slug.length; i++) {
    if (!PUBLIC_SLUG_ALPHABET.includes(slug[i] as string)) return false;
  }
  return true;
}

export function isValidHexColor(hex: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
}

export function isValidAccent(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return (ACCENT_PRESETS as readonly string[]).includes(value) || isValidHexColor(value);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(pw: string): boolean {
  return (
    typeof pw === "string" &&
    pw.length >= PASSWORD_MIN_LENGTH &&
    pw.length <= PASSWORD_MAX_LENGTH
  );
}

export function isValidId(id: unknown): id is ID {
  return typeof id === "string" && id.length > 0;
}

export function validateFolderName(name: string): { ok: boolean; error?: string } {
  const trimmed = typeof name === "string" ? name.trim() : "";
  if (trimmed.length === 0) return { ok: false, error: "El nombre no puede estar vacío" };
  if (trimmed.length > 100) return { ok: false, error: "El nombre no puede superar los 100 caracteres" };
  return { ok: true };
}
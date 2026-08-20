import { describe, it, expect } from "vitest";
import {
  isValidCellKind,
  isValidSubscriptionPlan,
  isValidSubscriptionStatus,
  isValidPublicSlug,
  isValidHexColor,
  isValidAccent,
  isValidEmail,
  isValidPassword,
  isValidId,
  validateFolderName,
} from "./validators.ts";

describe("isValidCellKind", () => {
  it("returns true for valid cell kinds", () => {
    expect(isValidCellKind("math")).toBe(true);
    expect(isValidCellKind("text")).toBe(true);
    expect(isValidCellKind("plot")).toBe(true);
  });

  it("returns false for invalid cell kinds", () => {
    expect(isValidCellKind("code")).toBe(false);
    expect(isValidCellKind("")).toBe(false);
    expect(isValidCellKind("Math")).toBe(false);
  });

  it("returns false for non-string types", () => {
    expect(isValidCellKind(null)).toBe(false);
    expect(isValidCellKind(undefined)).toBe(false);
    expect(isValidCellKind(123)).toBe(false);
    expect(isValidCellKind({})).toBe(false);
  });
});

describe("isValidSubscriptionPlan", () => {
  it("returns true for valid plans", () => {
    expect(isValidSubscriptionPlan("monthly")).toBe(true);
    expect(isValidSubscriptionPlan("annual")).toBe(true);
  });

  it("returns false for invalid plans", () => {
    expect(isValidSubscriptionPlan("weekly")).toBe(false);
    expect(isValidSubscriptionPlan("")).toBe(false);
    expect(isValidSubscriptionPlan("Monthly")).toBe(false);
  });

  it("returns false for non-string types", () => {
    expect(isValidSubscriptionPlan(null)).toBe(false);
    expect(isValidSubscriptionPlan(undefined)).toBe(false);
    expect(isValidSubscriptionPlan(123)).toBe(false);
  });
});

describe("isValidSubscriptionStatus", () => {
  it("returns true for valid statuses", () => {
    expect(isValidSubscriptionStatus("active")).toBe(true);
    expect(isValidSubscriptionStatus("pending")).toBe(true);
    expect(isValidSubscriptionStatus("cancelled")).toBe(true);
    expect(isValidSubscriptionStatus("expired")).toBe(true);
  });

  it("returns false for invalid statuses", () => {
    expect(isValidSubscriptionStatus("active ")).toBe(false);
    expect(isValidSubscriptionStatus("")).toBe(false);
    expect(isValidSubscriptionStatus("Active")).toBe(false);
  });

  it("returns false for non-string types", () => {
    expect(isValidSubscriptionStatus(null)).toBe(false);
    expect(isValidSubscriptionStatus(undefined)).toBe(false);
    expect(isValidSubscriptionStatus(123)).toBe(false);
  });
});

describe("isValidPublicSlug", () => {
  it("returns true for valid slugs", () => {
    expect(isValidPublicSlug("abcdefghijklmnopqrstuv")).toBe(true);
    expect(isValidPublicSlug("0123456789abcdefghijKL")).toBe(true);
    expect(isValidPublicSlug("aBcDeFgHiJkLmNoPqRsTuVwXyZ")).toBe(true);
  });

  it("returns false for slugs shorter than minimum length", () => {
    expect(isValidPublicSlug("abcdefghijklmnopqrstu")).toBe(false);
    expect(isValidPublicSlug("")).toBe(false);
    expect(isValidPublicSlug("short")).toBe(false);
  });

  it("returns false for slugs with invalid characters", () => {
    expect(isValidPublicSlug("abcdefghijklmnopqrstu-")).toBe(false);
    expect(isValidPublicSlug("abcdefghijklmnopqrstu_")).toBe(false);
    expect(isValidPublicSlug("abcdefghijklmnopqrstü")).toBe(false);
    expect(isValidPublicSlug("abcdefghijklmnopqrstu ")).toBe(false);
  });

  it("returns false for non-string types", () => {
    expect(isValidPublicSlug(null as unknown as string)).toBe(false);
    expect(isValidPublicSlug(undefined as unknown as string)).toBe(false);
  });
});

describe("isValidHexColor", () => {
  it("returns true for valid 3-digit hex colors", () => {
    expect(isValidHexColor("#fff")).toBe(true);
    expect(isValidHexColor("#000")).toBe(true);
    expect(isValidHexColor("#f00")).toBe(true);
    expect(isValidHexColor("#abc")).toBe(true);
    expect(isValidHexColor("#ABC")).toBe(true);
  });

  it("returns true for valid 6-digit hex colors", () => {
    expect(isValidHexColor("#ffffff")).toBe(true);
    expect(isValidHexColor("#000000")).toBe(true);
    expect(isValidHexColor("#ff0000")).toBe(true);
    expect(isValidHexColor("#a1b2c3")).toBe(true);
    expect(isValidHexColor("#ABCDEF")).toBe(true);
  });

  it("returns false for invalid hex colors", () => {
    expect(isValidHexColor("fff")).toBe(false);
    expect(isValidHexColor("#ffff")).toBe(false);
    expect(isValidHexColor("#fffffff")).toBe(false);
    expect(isValidHexColor("#gggggg")).toBe(false);
    expect(isValidHexColor("#")).toBe(false);
    expect(isValidHexColor("")).toBe(false);
  });

  it("returns false for non-string types", () => {
    expect(isValidHexColor(null as unknown as string)).toBe(false);
    expect(isValidHexColor(undefined as unknown as string)).toBe(false);
  });
});

describe("isValidAccent", () => {
  it("returns true for preset accents", () => {
    expect(isValidAccent("#6366f1")).toBe(true);
    expect(isValidAccent("#8b5cf6")).toBe(true);
    expect(isValidAccent("#ec4899")).toBe(true);
    expect(isValidAccent("#f59e0b")).toBe(true);
    expect(isValidAccent("#10b981")).toBe(true);
    expect(isValidAccent("#06b6d4")).toBe(true);
  });

  it("returns true for valid hex colors", () => {
    expect(isValidAccent("#123456")).toBe(true);
    expect(isValidAccent("#abcdef")).toBe(true);
    expect(isValidAccent("#fff")).toBe(true);
  });

  it("returns false for invalid accents", () => {
    expect(isValidAccent("#gggggg")).toBe(false);
    expect(isValidAccent("red")).toBe(false);
    expect(isValidAccent("")).toBe(false);
  });

  it("returns false for non-string types", () => {
    expect(isValidAccent(null)).toBe(false);
    expect(isValidAccent(undefined)).toBe(false);
    expect(isValidAccent(123)).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("returns true for valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("test.user@domain.org")).toBe(true);
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("user+tag@example.com")).toBe(true);
  });

  it("returns false for invalid emails", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("user")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
    expect(isValidEmail("user@example")).toBe(false);
    expect(isValidEmail("user @example.com")).toBe(false);
  });

  it("returns false for non-string types", () => {
    expect(isValidEmail(null as unknown as string)).toBe(false);
    expect(isValidEmail(undefined as unknown as string)).toBe(false);
  });
});

describe("isValidPassword", () => {
  it("returns true for valid passwords", () => {
    expect(isValidPassword("12345678")).toBe(true);
    expect(isValidPassword("password123")).toBe(true);
    expect(isValidPassword("a".repeat(128))).toBe(true);
  });

  it("returns false for passwords too short", () => {
    expect(isValidPassword("")).toBe(false);
    expect(isValidPassword("1234567")).toBe(false);
    expect(isValidPassword("short")).toBe(false);
  });

  it("returns false for passwords too long", () => {
    expect(isValidPassword("a".repeat(129))).toBe(false);
    expect(isValidPassword("a".repeat(200))).toBe(false);
  });

  it("returns false for non-string types", () => {
    expect(isValidPassword(null as unknown as string)).toBe(false);
    expect(isValidPassword(undefined as unknown as string)).toBe(false);
  });
});

describe("isValidId", () => {
  it("returns true for valid IDs", () => {
    expect(isValidId("abc123")).toBe(true);
    expect(isValidId("1")).toBe(true);
    expect(isValidId("a".repeat(100))).toBe(true);
  });

  it("returns false for empty strings", () => {
    expect(isValidId("")).toBe(false);
  });

  it("returns false for non-string types", () => {
    expect(isValidId(null)).toBe(false);
    expect(isValidId(undefined)).toBe(false);
    expect(isValidId(123)).toBe(false);
    expect(isValidId({})).toBe(false);
  });
});

describe("validateFolderName", () => {
  it("returns ok for valid names", () => {
    expect(validateFolderName("My Folder")).toEqual({ ok: true });
    expect(validateFolderName("a")).toEqual({ ok: true });
    expect(validateFolderName("a".repeat(100))).toEqual({ ok: true });
  });

  it("trims whitespace before validation", () => {
    expect(validateFolderName("  My Folder  ")).toEqual({ ok: true });
    expect(validateFolderName("   ")).toEqual({ ok: false, error: "El nombre no puede estar vacío" });
  });

  it("returns error for empty names", () => {
    expect(validateFolderName("")).toEqual({ ok: false, error: "El nombre no puede estar vacío" });
    expect(validateFolderName("   ")).toEqual({ ok: false, error: "El nombre no puede estar vacío" });
  });

  it("returns error for names exceeding 100 characters", () => {
    expect(validateFolderName("a".repeat(101))).toEqual({ ok: false, error: "El nombre no puede superar los 100 caracteres" });
    expect(validateFolderName("a".repeat(200))).toEqual({ ok: false, error: "El nombre no puede superar los 100 caracteres" });
  });
});

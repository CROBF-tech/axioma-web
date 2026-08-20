import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import {
  isSubscriptionActive,
  isSubscriptionExpired,
  subscriptionEndDate,
  planPrice,
  planCurrency,
  planFrequency,
  annualSavingsPercent,
  mpEventToSubscriptionStatus,
  verifyMpSignature,
} from "./subscription.ts";

async function hmacSha256(body: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const buf = await globalThis.crypto.subtle.sign("HMAC", key, enc.encode(body));
  const bytes = new Uint8Array(buf);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

describe("isSubscriptionActive", () => {
  it("returns false when subscription is null", () => {
    expect(isSubscriptionActive(null)).toBe(false);
  });

  it("returns false when status is not active", () => {
    expect(isSubscriptionActive({ status: "pending" })).toBe(false);
    expect(isSubscriptionActive({ status: "cancelled" })).toBe(false);
    expect(isSubscriptionActive({ status: "expired" })).toBe(false);
  });

  it("returns true when active and currentPeriodEnd is in the future", () => {
    const future = new Date(Date.now() + 86400000);
    expect(isSubscriptionActive({ status: "active", currentPeriodEnd: future })).toBe(true);
  });

  it("returns false when active and currentPeriodEnd is in the past", () => {
    const past = new Date(Date.now() - 86400000);
    expect(isSubscriptionActive({ status: "active", currentPeriodEnd: past })).toBe(false);
  });

  it("returns true when active and currentPeriodEnd is undefined", () => {
    expect(isSubscriptionActive({ status: "active" })).toBe(true);
  });
});

describe("isSubscriptionExpired", () => {
  it("returns true when status is expired", () => {
    expect(isSubscriptionExpired({ status: "expired" })).toBe(true);
  });

  it("returns false when active and currentPeriodEnd is in the future", () => {
    const future = new Date(Date.now() + 86400000);
    expect(isSubscriptionExpired({ status: "active", currentPeriodEnd: future })).toBe(false);
  });

  it("returns true when active and currentPeriodEnd is in the past", () => {
    const past = new Date(Date.now() - 86400000);
    expect(isSubscriptionExpired({ status: "active", currentPeriodEnd: past })).toBe(true);
  });

  it("returns false when active and currentPeriodEnd is undefined", () => {
    expect(isSubscriptionExpired({ status: "active" })).toBe(false);
  });
});

describe("subscriptionEndDate", () => {
  it("returns a Date from a numeric timestamp", () => {
    const ts = Date.now();
    const result = subscriptionEndDate({ currentPeriodEnd: ts });
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(ts);
  });

  it("returns the same Date instance when currentPeriodEnd is a Date", () => {
    const d = new Date();
    expect(subscriptionEndDate({ currentPeriodEnd: d })).toBe(d);
  });

  it("returns null when currentPeriodEnd is null", () => {
    expect(subscriptionEndDate({ currentPeriodEnd: null })).toBeNull();
  });

  it("returns null when currentPeriodEnd is undefined", () => {
    expect(subscriptionEndDate({})).toBeNull();
  });
});

describe("planPrice", () => {
  it("returns 2 for monthly plan", () => {
    expect(planPrice("monthly")).toBe(2);
  });

  it("returns 18 for annual plan", () => {
    expect(planPrice("annual")).toBe(18);
  });
});

describe("planCurrency", () => {
  it("returns USD for all plans", () => {
    expect(planCurrency("monthly")).toBe("USD");
    expect(planCurrency("annual")).toBe("USD");
  });
});

describe("planFrequency", () => {
  it("returns monthly frequency for monthly plan", () => {
    expect(planFrequency("monthly")).toEqual({ frequency: 1, frequencyType: "months" });
  });

  it("returns annual frequency for annual plan", () => {
    expect(planFrequency("annual")).toEqual({ frequency: 12, frequencyType: "months" });
  });
});

describe("annualSavingsPercent", () => {
  it("returns 25%", () => {
    expect(annualSavingsPercent()).toBe(25);
  });
});

describe("mpEventToSubscriptionStatus", () => {
  it("maps preapproval_authorized to active", () => {
    expect(mpEventToSubscriptionStatus("preapproval_authorized")).toBe("active");
  });

  it("maps payment_failed to pending", () => {
    expect(mpEventToSubscriptionStatus("payment_failed")).toBe("pending");
  });

  it("maps cancelled to cancelled", () => {
    expect(mpEventToSubscriptionStatus("cancelled")).toBe("cancelled");
  });

  it("maps unknown events to expired", () => {
    expect(mpEventToSubscriptionStatus("unknown")).toBe("expired");
    expect(mpEventToSubscriptionStatus("")).toBe("expired");
  });
});

describe("verifyMpSignature", () => {
  let originalCrypto: Crypto | undefined;

  beforeAll(() => {
    originalCrypto = globalThis.crypto;
  });

  afterAll(() => {
    vi.stubGlobal("crypto", originalCrypto);
  });

  it("returns true for a valid signature", async () => {
    const body = JSON.stringify({ id: "123", status: "active" });
    const secret = "test-secret";
    const signature = await hmacSha256(body, secret);
    expect(await verifyMpSignature(signature, body, secret)).toBe(true);
  });

  it("returns false for an invalid signature", async () => {
    const body = JSON.stringify({ id: "123", status: "active" });
    const secret = "test-secret";
    const badSignature = "a".repeat(64);
    expect(await verifyMpSignature(badSignature, body, secret)).toBe(false);
  });

  it("returns false when body is modified", async () => {
    const body = JSON.stringify({ id: "123", status: "active" });
    const secret = "test-secret";
    const signature = await hmacSha256(body, secret);
    const tamperedBody = body.replace("active", "inactive");
    expect(await verifyMpSignature(signature, tamperedBody, secret)).toBe(false);
  });

  it("works when crypto is not global by using vi.stubGlobal", async () => {
    const body = JSON.stringify({ id: "123" });
    const secret = "test-secret";
    const signature = await hmacSha256(body, secret);
    const fakeCrypto = {
      subtle: originalCrypto!.subtle,
    } as Crypto;
    vi.stubGlobal("crypto", fakeCrypto);
    expect(await verifyMpSignature(signature, body, secret)).toBe(true);
    vi.stubGlobal("crypto", originalCrypto);
  });
});

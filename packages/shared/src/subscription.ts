import type { SubscriptionPlan, SubscriptionStatus } from "./index.ts";
import { PLANS } from "./constants.ts";

function toDate(value: Date | number | null | undefined): Date | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;
  return new Date(value);
}

export function isSubscriptionActive<S extends { status: SubscriptionStatus; currentPeriodEnd?: Date | number | null }>(
  sub: S | null,
  now: Date = new Date(),
): boolean {
  if (!sub) return false;
  if (sub.status !== "active") return false;
  const end = subscriptionEndDate(sub);
  if (!end) return true;
  return end.getTime() >= now.getTime();
}

export function isSubscriptionExpired<S extends { status: SubscriptionStatus; currentPeriodEnd?: Date | number | null }>(
  sub: S,
  now: Date = new Date(),
): boolean {
  if (sub.status === "expired") return true;
  const end = subscriptionEndDate(sub);
  if (!end) return false;
  return end.getTime() < now.getTime();
}

export function subscriptionEndDate<S extends { currentPeriodEnd?: Date | number | null }>(
  sub: S,
): Date | null {
  return toDate(sub.currentPeriodEnd ?? null);
}

export function planPrice(plan: SubscriptionPlan): number {
  return PLANS[plan].amount;
}

export function planCurrency(plan: SubscriptionPlan): "USD" {
  return PLANS[plan].currency;
}

export function planFrequency(plan: SubscriptionPlan): { frequency: number; frequencyType: "months" } {
  return {
    frequency: PLANS[plan].frequency,
    frequencyType: PLANS[plan].frequencyType,
  };
}

export function annualSavingsPercent(): number {
  const monthly = PLANS.monthly.amount * 12;
  const annual = PLANS.annual.amount;
  if (monthly <= 0) return 0;
  return Math.round(((monthly - annual) / monthly) * 100);
}

export function mpEventToSubscriptionStatus(eventType: string): SubscriptionStatus {
  switch (eventType) {
    case "preapproval_authorized":
      return "active";
    case "payment_failed":
      return "pending";
    case "cancelled":
      return "cancelled";
    default:
      return "expired";
  }
}

export async function verifyMpSignature(
  signature: string,
  body: string,
  secret: string,
): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expectedBuf = await globalThis.crypto.subtle.sign("HMAC", key, enc.encode(body));
  const expected = bufToHex(expectedBuf);
  return timingSafeEqual(expected, signature);
}

function bufToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if (b === undefined) continue;
    out += b === 0 ? "00" : b.toString(16).padStart(2, "0");
  }
  return out;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
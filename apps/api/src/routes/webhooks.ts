import { Hono } from "hono";
import { eq } from "drizzle-orm";
import type { DbClient } from "@axioma/db";
import { subscriptions } from "@axioma/db/schema";
import type { AppEnv } from "../index.ts";
import {
  mpEventToSubscriptionStatus,
  verifyMpSignature,
} from "@axioma/shared";

export interface WebhooksRouterDeps {
  db: DbClient;
  mpWebhookSecret: string;
  nodeEnv: "development" | "test" | "production";
}

interface MpWebhookPayload {
  type?: string;
  data?: { id?: string | number };
  [key: string]: unknown;
}

export function createWebhooksRouter(deps: WebhooksRouterDeps): Hono<AppEnv> {
  const router = new Hono<AppEnv>();

  router.post("/mp", async (c) => {
    const raw = await c.req.text();
    const signature = c.req.header("x-signature") ?? "";

    const devBypass =
      deps.nodeEnv !== "production" &&
      c.req.header("x-dev-bypass") === "1";

    if (!devBypass) {
      if (!signature) {
        return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
      }
      const valid = await verifyMpSignature(signature, raw, deps.mpWebhookSecret);
      if (!valid) {
        return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
      }
    }

    let payload: MpWebhookPayload;
    try {
      payload = JSON.parse(raw) as MpWebhookPayload;
    } catch {
      return c.json({ error: "Validation", code: "VALIDATION" }, 400);
    }

    const eventType = payload.type ?? "";
    const preapprovalId =
      typeof payload.data?.id === "string" ? payload.data.id : null;

    if (!preapprovalId) {
      return c.text("", 200);
    }

    const found = await deps.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.mpPreapprovalId, preapprovalId))
      .limit(1);
    const sub = found[0] ?? null;
    if (!sub) {
      return c.text("", 200);
    }

    const newStatus = mpEventToSubscriptionStatus(eventType);
    const now = new Date();
    const nextPeriodEnd = computeNextPeriodEnd(sub.plan, now);

    await deps.db
      .update(subscriptions)
      .set({ status: newStatus, currentPeriodEnd: nextPeriodEnd, updatedAt: now })
      .where(eq(subscriptions.id, sub.id));

    return c.text("", 200);
  });

  return router;
}

function computeNextPeriodEnd(
  plan: "monthly" | "annual",
  from: Date,
): Date {
  const next = new Date(from);
  if (plan === "annual") {
    next.setUTCFullYear(next.getUTCFullYear() + 1);
  } else {
    next.setUTCMonth(next.getUTCMonth() + 1);
  }
  return next;
}
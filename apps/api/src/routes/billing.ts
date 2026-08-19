import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { DbClient } from "@axioma/db";
import { subscriptions } from "@axioma/db/schema";
import type { AppEnv } from "../index.ts";
import type { MpClient } from "../services/mercadopago.ts";
import { requireAuth } from "../middleware/require-auth.ts";
import { requireSubscription } from "../middleware/require-subscription.ts";
import type { Auth } from "../auth/auth.ts";
import {
  CheckoutRequestSchema,
  ERROR_CODES,
  isSubscriptionActive,
  planCurrency,
  planFrequency,
  planPrice,
} from "@axioma/shared";

export interface BillingRouterDeps {
  db: DbClient;
  auth: Auth;
  mp: MpClient;
  webUrl: string;
}

export function createBillingRouter(deps: BillingRouterDeps): Hono<AppEnv> {
  const router = new Hono<AppEnv>();
  router.use("*", requireAuth(deps.auth));

  router.post("/checkout", async (c) => {
    const json = await c.req.json();
    const parsed = CheckoutRequestSchema.safeParse(json);
    if (!parsed.success) {
      return c.json({ error: "Validation", code: ERROR_CODES.VALIDATION }, 400);
    }
    const { plan } = parsed.data;
    const user = c.get("user");

    const existing = await deps.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1);
    const current = existing[0] ?? null;
    if (current && isSubscriptionActive(current)) {
      return c.json({ error: "Conflict", code: ERROR_CODES.CONFLICT }, 409);
    }

    const amount = planPrice(plan);
    const currency = planCurrency(plan);
    const { frequency, frequencyType } = planFrequency(plan);

    const created = await deps.mp.preapproval.create({
      body: {
        reason: "Axioma",
        auto_recurring: {
          frequency,
          frequency_type: frequencyType,
          transaction_amount: amount,
          currency_id: currency,
        },
        back_url: `${deps.webUrl}/billing/return`,
        payer_email: user.email,
      },
    });

    const mpPreapprovalId = created.id ?? null;
    if (!mpPreapprovalId) {
      return c.json({ error: "Internal", code: ERROR_CODES.INTERNAL }, 500);
    }

    const now = new Date();
    await deps.db.insert(subscriptions).values({
      id: randomUUID(),
      userId: user.id,
      plan,
      status: "pending",
      mpPreapprovalId,
      createdAt: now,
      updatedAt: now,
    });

    return c.json({ init_point: created.init_point ?? "" }, 200);
  });

  router.get("/status", async (c) => {
    const user = c.get("user");
    const found = await deps.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1);
    const sub = found[0] ?? null;
    if (!sub) {
      return c.json(
        { status: "none", plan: null, current_period_end: null },
        200,
      );
    }
    return c.json(
      {
        status: sub.status,
        plan: sub.plan,
        current_period_end:
          sub.currentPeriodEnd instanceof Date
            ? sub.currentPeriodEnd.toISOString()
            : null,
      },
      200,
    );
  });

  router.post("/cancel", requireSubscription(deps.db), async (c) => {
    const user = c.get("user");
    const found = await deps.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1);
    const sub = found[0] ?? null;
    if (!sub) {
      return c.json({ error: "NotFound", code: ERROR_CODES.NOT_FOUND }, 404);
    }
    if (!isSubscriptionActive(sub)) {
      return c.json(
        { error: "Payment required", code: ERROR_CODES.PAYMENT_REQUIRED },
        402,
      );
    }

    if (sub.mpPreapprovalId) {
      try {
        await deps.mp.preapproval.update({
          id: sub.mpPreapprovalId,
          body: { status: "cancelled" },
        });
      } catch (err) {
        console.error("[billing] mp cancel failed", err);
        return c.json({ error: "Internal", code: ERROR_CODES.INTERNAL }, 500);
      }
    }

    const now = new Date();
    await deps.db
      .update(subscriptions)
      .set({ status: "cancelled", updatedAt: now })
      .where(eq(subscriptions.id, sub.id));

    return c.json(
      {
        status: "cancelled",
        plan: sub.plan,
        current_period_end:
          sub.currentPeriodEnd instanceof Date
            ? sub.currentPeriodEnd.toISOString()
            : null,
      },
      200,
    );
  });

  return router;
}
import type { MiddlewareHandler } from "hono";
import { eq } from "drizzle-orm";
import type { DbClient } from "@axioma/db";
import { subscriptions } from "@axioma/db/schema";
import type { AppEnv } from "../index.ts";
import { isSubscriptionActive } from "@axioma/shared";

export function requireSubscription(db: DbClient): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
    }
    const found = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1);
    const sub = found[0] ?? null;
    if (!isSubscriptionActive(sub)) {
      return c.json({ error: "Payment required", code: "PAYMENT_REQUIRED" }, 402);
    }
    await next();
  };
}
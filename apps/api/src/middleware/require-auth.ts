import type { MiddlewareHandler } from "hono";
import type { Auth } from "../auth/auth.ts";
import type { AppEnv } from "../index.ts";

export function requireAuth(auth: Auth): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) {
      return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
    }
    c.set("user", session.user);
    c.set("session", session.session);
    await next();
  };
}
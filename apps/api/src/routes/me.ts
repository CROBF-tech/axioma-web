import { Hono } from "hono";
import type { AppEnv } from "../index.ts";
import { requireAuth } from "../middleware/require-auth.ts";
import type { Auth } from "../auth/auth.ts";

export function createMeRouter(auth: Auth): Hono<AppEnv> {
  const router = new Hono<AppEnv>();
  router.use("*", requireAuth(auth));
  router.get("/", (c) => {
    const user = c.get("user");
    return c.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  });
  return router;
}
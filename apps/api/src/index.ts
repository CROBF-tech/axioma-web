import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { ApiDeps } from "./services/deps.ts";
import type { Session, User } from "./auth/auth.ts";
import { createMeRouter } from "./routes/me.ts";

export type AppEnv = {
  Variables: {
    user: User;
    session: Session;
  };
};

export interface CreateAppOptions {
  env: {
    NODE_ENV: "development" | "test" | "production";
    CORS_ORIGIN: string;
  };
  deps: ApiDeps;
}

export function createApp(opts: CreateAppOptions): Hono<AppEnv> {
  const app = new Hono<AppEnv>();
  const { deps } = opts;

  app.use("*", logger());
  app.use(
    "*",
    cors({
      origin: opts.env.CORS_ORIGIN,
      credentials: true,
    }),
  );

  app.all("/api/auth/*", (c) => {
    return deps.auth.handler(c.req.raw);
  });

  app.route("/api/me", createMeRouter(deps.auth));

  app.get("/health", (c) =>
    c.json({
      status: "ok",
      ts: new Date().toISOString(),
      deps: { db: "ready" },
    }),
  );

  app.get("/version", (c) => c.json({ version: "0.0.0" }));

  app.notFound((c) => c.json({ error: "NotFound", code: "NOT_FOUND" }, 404));

  app.onError((err, c) => {
    const isProd = opts.env.NODE_ENV === "production";
    console.error("[api] unhandled", err);
    return c.json(
      {
        error: "InternalServerError",
        code: "INTERNAL",
        ...(isProd ? {} : { detail: err.message }),
      },
      500,
    );
  });

  return app;
}

export default createApp;
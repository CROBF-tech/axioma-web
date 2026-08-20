import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { createMeRouter } from "./me.ts";
import { requireAuth } from "../middleware/require-auth.ts";
import type { AppEnv } from "../index.ts";
import type { ApiDeps } from "../services/deps.ts";

interface MockUser {
  id: string;
  email: string;
  name: string;
}

function makeDeps(user: MockUser | null): ApiDeps {
  return {
    db: {} as unknown as ApiDeps["db"],
    auth: {
      api: {
        getSession: async () =>
          user
            ? { session: { id: "s1" }, user: { id: user.id, email: user.email, name: user.name } }
            : null,
      },
      handler: (_req: Request) =>
        Promise.resolve(
          new Response("{}", { status: 200, headers: { "content-type": "application/json" } }),
        ),
    } as unknown as ApiDeps["auth"],
    mp: {} as unknown as ApiDeps["mp"],
  };
}

function makeApp(deps: ApiDeps): Hono<AppEnv> {
  const app = new Hono<AppEnv>();
  app.use("*", requireAuth(deps.auth));
  app.route("/api/me", createMeRouter(deps.auth));
  return app;
}

describe("me router", () => {
  it("GET /api/me sin auth responde 401", async () => {
    const deps = makeDeps(null);
    const app = makeApp(deps);
    const res = await app.request("/api/me");
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: string; code: string };
    expect(body.error).toBe("Unauthorized");
    expect(body.code).toBe("UNAUTHORIZED");
  });

  it("GET /api/me con auth responde 200 con id/email/name", async () => {
    const deps = makeDeps({ id: "user-123", email: "test@example.com", name: "Test User" });
    const app = makeApp(deps);
    const res = await app.request("/api/me");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: string; email: string; name: string };
    expect(body.id).toBe("user-123");
    expect(body.email).toBe("test@example.com");
    expect(body.name).toBe("Test User");
  });
});

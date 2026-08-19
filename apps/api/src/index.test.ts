import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { createApp, type AppEnv } from "./index.ts";
import type { ApiDeps } from "./services/deps.ts";

function makeApp() {
  const deps = {
    db: {} as unknown as ApiDeps["db"],
    auth: {
      handler: (_req: Request) =>
        Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
        ),
    } as unknown as ApiDeps["auth"],
    mp: {
      preapproval: {
        create: () =>
          Promise.resolve({ id: "mp-id", init_point: "https://mp.test/init" }),
        update: () => Promise.resolve({ id: "mp-id", status: "cancelled" }),
      },
    } as unknown as ApiDeps["mp"],
  };
  return createApp({
    env: {
      NODE_ENV: "test",
      CORS_ORIGIN: "http://localhost:5173",
      MP_WEBHOOK_SECRET: "test-secret",
      WEB_URL: "http://localhost:5173",
    },
    deps,
  });
}

async function req(app: Hono<AppEnv>, path: string, init?: RequestInit) {
  return app.request(path, init);
}

describe("app", () => {
  it("GET /health responde 200 con { status: 'ok' }", async () => {
    const app = makeApp();
    const res = await req(app, "/health");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; ts: string };
    expect(body.status).toBe("ok");
    expect(typeof body.ts).toBe("string");
  });

  it("GET /version responde JSON con version", async () => {
    const app = makeApp();
    const res = await req(app, "/version");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { version: string };
    expect(typeof body.version).toBe("string");
  });

  it("404 devuelve JSON", async () => {
    const app = makeApp();
    const res = await req(app, "/no-existe");
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error: string; code: string };
    expect(body.code).toBe("NOT_FOUND");
  });

  it("instancia es una Hono app válida", () => {
    const app = makeApp();
    expect(app).toBeInstanceOf(Hono);
  });

  it("api/auth/* delega al handler de better-auth", async () => {
    const app = makeApp();
    const res = await req(app, "/api/auth/sign-up/email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "a@b.c", password: "longpassword" }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
  });
});
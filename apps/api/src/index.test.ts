import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { createApp } from "./index.ts";

function makeApp() {
  return createApp({
    env: { NODE_ENV: "test", CORS_ORIGIN: "http://localhost:5173" },
    deps: { db: {} as unknown as import("./services/deps.ts").ApiDeps["db"] },
  });
}

async function req(app: Hono, path: string, init?: RequestInit) {
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
});

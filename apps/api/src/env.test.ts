import { describe, it, expect } from "vitest";
import { loadEnv } from "./env.ts";

const base = {
  DATABASE_URL: "libsql://test.turso.io",
  BETTER_AUTH_SECRET: "x".repeat(32),
  BETTER_AUTH_URL: "http://localhost:3000",
  MP_ACCESS_TOKEN: "TEST-mp-token",
  MP_WEBHOOK_SECRET: "mp-webhook-secret",
  WEB_URL: "http://localhost:5173",
} as Record<string, string>;

describe("loadEnv", () => {
  it("carga con defaults válidos", () => {
    const env = loadEnv({ ...base, NODE_ENV: "development" } as NodeJS.ProcessEnv);
    expect(env.PORT).toBe(3000);
    expect(env.CORS_ORIGIN).toBe("http://localhost:5173");
    expect(env.NODE_ENV).toBe("development");
  });

  it("acepta TEST_DATABASE_URL y TEST_DATABASE_AUTH_TOKEN opcionales", () => {
    const env = loadEnv({
      ...base,
      NODE_ENV: "test",
      TEST_DATABASE_URL: "libsql://test-db.turso.io",
      TEST_DATABASE_AUTH_TOKEN: "test-token",
    } as NodeJS.ProcessEnv);
    expect(env.TEST_DATABASE_URL).toBe("libsql://test-db.turso.io");
    expect(env.TEST_DATABASE_AUTH_TOKEN).toBe("test-token");
  });

  it("falla si BETTER_AUTH_SECRET es demasiado corto", () => {
    expect(() =>
      loadEnv({ ...base, BETTER_AUTH_SECRET: "short" } as NodeJS.ProcessEnv),
    ).toThrow(/BETTER_AUTH_SECRET/);
  });

  it("falla si BETTER_AUTH_URL no es URL válida", () => {
    expect(() =>
      loadEnv({ ...base, BETTER_AUTH_URL: "no-es-url" } as NodeJS.ProcessEnv),
    ).toThrow();
  });

  it("coercea PORT a número", () => {
    const env = loadEnv({ ...base, PORT: "4242" } as NodeJS.ProcessEnv);
    expect(env.PORT).toBe(4242);
  });

  it("rechaza NODE_ENV desconocido", () => {
    expect(() =>
      loadEnv({ ...base, NODE_ENV: "otro" } as NodeJS.ProcessEnv),
    ).toThrow();
  });
});

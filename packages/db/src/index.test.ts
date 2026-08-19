import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createDb, createTestDbFromEnv } from "./server.ts";
import { getTestDbUrl, getTestDbAuthToken } from "./env.ts";

const TEST_URL = process.env.TEST_DATABASE_URL ?? "file:memory:?mode=memory&cache=private";

describe("createDb", () => {
  it("retorna un cliente drizzle y el cliente raw dado un url de libSQL en memoria", () => {
    const { db, client } = createDb({ url: TEST_URL });
    expect(db).toBeDefined();
    expect(client).toBeDefined();
  });

  it("acepta authToken opcional sin fallar", () => {
    const { db, client } = createDb({ url: TEST_URL, authToken: undefined });
    expect(db).toBeDefined();
    expect(client).toBeDefined();
  });

  it("puede cerrar el cliente raw", async () => {
    const { client } = createDb({ url: TEST_URL });
    await client.close();
    expect(true).toBe(true);
  });
});

describe("createTestDbFromEnv", () => {
  const tempTestDbPath = "file:tmp-test-env.db";

  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("usa TEST_DATABASE_URL y TEST_DATABASE_AUTH_TOKEN cuando existen", () => {
    vi.stubEnv("TEST_DATABASE_URL", tempTestDbPath);
    vi.stubEnv("TEST_DATABASE_AUTH_TOKEN", "test-token");

    expect(getTestDbUrl()).toBe(tempTestDbPath);
    expect(getTestDbAuthToken()).toBe("test-token");

    const { db, client } = createTestDbFromEnv();
    expect(db).toBeDefined();
    expect(client).toBeDefined();
  });

  it("falla si falta TEST_DATABASE_URL", () => {
    vi.stubEnv("TEST_DATABASE_URL", undefined);
    expect(() => createTestDbFromEnv()).toThrow(/Missing TEST_DATABASE_URL/);
  });
});

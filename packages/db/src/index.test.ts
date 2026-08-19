import { describe, it, expect } from "vitest";
import { createDb, createTestDbFromEnv } from "./server.ts";
import { getTestDbUrl, getTestDbAuthToken } from "./env.ts";

const TEST_URL = process.env.TEST_DATABASE_URL ?? "file::memory:?cache=shared";

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
  it("usa TEST_DATABASE_URL y TEST_DATABASE_AUTH_TOKEN cuando existen", () => {
    const originalUrl = process.env.TEST_DATABASE_URL;
    const originalToken = process.env.TEST_DATABASE_AUTH_TOKEN;
    process.env.TEST_DATABASE_URL = "file::test-env.db";
    process.env.TEST_DATABASE_AUTH_TOKEN = "test-token";

    expect(getTestDbUrl()).toBe("file::test-env.db");
    expect(getTestDbAuthToken()).toBe("test-token");

    const { db, client } = createTestDbFromEnv();
    expect(db).toBeDefined();
    expect(client).toBeDefined();

    process.env.TEST_DATABASE_URL = originalUrl;
    process.env.TEST_DATABASE_AUTH_TOKEN = originalToken;
  });

  it("falla si falta TEST_DATABASE_URL", () => {
    const originalUrl = process.env.TEST_DATABASE_URL;
    delete process.env.TEST_DATABASE_URL;
    expect(() => createTestDbFromEnv()).toThrow(/Missing TEST_DATABASE_URL/);
    process.env.TEST_DATABASE_URL = originalUrl;
  });
});

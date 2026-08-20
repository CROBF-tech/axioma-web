import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getDbUrl,
  getDbAuthToken,
  getApiUrl,
  isServer,
  isBrowser,
} from "./env.ts";

describe("getDbUrl", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("retorna DATABASE_URL cuando existe en Node", () => {
    vi.stubEnv("DATABASE_URL", "file:./test.db");
    expect(getDbUrl()).toBe("file:./test.db");
  });

  it("lanza error cuando DATABASE_URL no existe en Node", () => {
    vi.stubEnv("DATABASE_URL", undefined);
    expect(() => getDbUrl()).toThrow(/Missing DATABASE_URL/);
  });
});

describe("getDbAuthToken", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("retorna DATABASE_AUTH_TOKEN cuando existe en Node", () => {
    vi.stubEnv("DATABASE_AUTH_TOKEN", "test-token-123");
    expect(getDbAuthToken()).toBe("test-token-123");
  });

  it("retorna undefined cuando DATABASE_AUTH_TOKEN no existe en Node", () => {
    vi.stubEnv("DATABASE_AUTH_TOKEN", undefined);
    expect(getDbAuthToken()).toBeUndefined();
  });
});

describe("getApiUrl", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("retorna string vacío en Node", () => {
    expect(getApiUrl()).toBe("");
  });
});

describe("isServer / isBrowser", () => {
  it("isServer es true en Node", () => {
    expect(isServer).toBe(true);
  });

  it("isBrowser es false en Node", () => {
    expect(isBrowser).toBe(false);
  });
});

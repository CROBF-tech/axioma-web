declare const window: unknown | undefined;

declare const process: {
  env: Record<string, string | undefined>;
};

function isNode(): boolean {
  return typeof process !== "undefined" && process.env !== undefined;
}

export function getDbUrl(): string {
  if (isNode()) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("Missing DATABASE_URL in server environment");
    }
    return url;
  }
  return "";
}

export function getDbAuthToken(): string | undefined {
  if (isNode()) {
    return process.env.DATABASE_AUTH_TOKEN;
  }
  return undefined;
}

export function getTestDbUrl(): string | undefined {
  if (isNode()) {
    return process.env.TEST_DATABASE_URL;
  }
  return undefined;
}

export function getTestDbAuthToken(): string | undefined {
  if (isNode()) {
    return process.env.TEST_DATABASE_AUTH_TOKEN;
  }
  return undefined;
}

export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    const meta = import.meta as unknown as { env: Record<string, string | undefined> };
    const url = meta.env.VITE_API_URL;
    if (!url) {
      throw new Error("Missing VITE_API_URL in client environment");
    }
    return url;
  }
  return "";
}

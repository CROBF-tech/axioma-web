import { drizzle } from "drizzle-orm/libsql";
import { createClient, type Client } from "@libsql/client";
import * as schema from "./schema/index.ts";

export type DbClient = ReturnType<typeof drizzle<typeof schema>>;

export interface CreateDbOptions {
  url: string;
  authToken?: string;
}

export function createDb(opts: CreateDbOptions): { db: DbClient; client: Client } {
  const client: Client = createClient({
    url: opts.url,
    authToken: opts.authToken,
  });
  const db = drizzle(client, { schema });
  return { db, client };
}

export * as schema from "./schema/index.ts";

declare const process: {
  env: Record<string, string | undefined>;
};

export function createDbFromEnv(): { db: DbClient; client: Client } {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Missing DATABASE_URL");
  }
  return createDb({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
}

export function createTestDbFromEnv(): { db: DbClient; client: Client } {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error("Missing TEST_DATABASE_URL");
  }
  return createDb({ url, authToken: process.env.TEST_DATABASE_AUTH_TOKEN });
}

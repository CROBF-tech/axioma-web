import { createDb, createTestDbFromEnv, type DbClient } from "@axioma/db";

export interface ApiDeps {
  db: DbClient;
}

export async function makeDeps(databaseUrl: string, authToken?: string): Promise<ApiDeps> {
  const { db } = await createDb({ url: databaseUrl, authToken });
  return { db };
}

export async function makeTestDeps(): Promise<ApiDeps> {
  const { db } = createTestDbFromEnv();
  return { db };
}

import {
  getDbUrl,
  getDbAuthToken,
  getTestDbUrl,
  getTestDbAuthToken,
  isBrowser,
  isServer,
} from "./env.ts";

export type { NotebookRow, NewNotebookRow } from "./schema/notebooks.ts";
export type { CellRow, NewCellRow } from "./schema/cells.ts";
export type { FolderRow, NewFolderRow } from "./schema/folders.ts";
export type { SubscriptionRow, NewSubscriptionRow } from "./schema/subscriptions.ts";
export type {
  UserRow,
  NewUserRow,
  SessionRow,
  NewSessionRow,
  AccountRow,
  NewAccountRow,
  VerificationRow,
  NewVerificationRow,
} from "./schema/auth.ts";

export * as schema from "./schema/index.ts";

export type { DbClient, CreateDbOptions } from "./server.ts";
export { createDbFromEnv, createTestDbFromEnv } from "./server.ts";

export type { Notebook, NewNotebook, Cell, NewCell, CellKind } from "./types.ts";

export const databaseUrl = getDbUrl;
export const databaseAuthToken = getDbAuthToken;
export const testDatabaseUrl = getTestDbUrl;
export const testDatabaseAuthToken = getTestDbAuthToken;

export { isBrowser, isServer };

export * from "./browser.ts";

export async function createDb(
  opts: { url: string; authToken?: string },
): Promise<{ db: import("./server.ts").DbClient; client: import("@libsql/client").Client }> {
  const { createDb: createDbServer } = await import("./server.ts");
  return createDbServer(opts);
}

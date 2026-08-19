import type { DbClient } from "@axioma/db";
import type { Auth } from "../auth/auth.ts";

export interface ApiDeps {
  db: DbClient;
  auth: Auth;
}

export function makeDeps(db: DbClient, auth: Auth): ApiDeps {
  return { db, auth };
}
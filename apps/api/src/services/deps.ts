import type { DbClient } from "@axioma/db";
import type { Auth } from "../auth/auth.ts";
import type { MpClient } from "./mercadopago.ts";

export interface ApiDeps {
  db: DbClient;
  auth: Auth;
  mp: MpClient;
}

export function makeDeps(db: DbClient, auth: Auth, mp: MpClient): ApiDeps {
  return { db, auth, mp };
}
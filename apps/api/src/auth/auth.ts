import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { DbClient } from "@axioma/db";
import * as schema from "@axioma/db/schema";

export interface CreateAuthOptions {
  secret: string;
  baseURL: string;
  nodeEnv?: "development" | "test" | "production";
}

export function createAuth(db: DbClient, opts: CreateAuthOptions) {
  const isProd = opts.nodeEnv === "production";
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
      },
    }),
    secret: opts.secret,
    baseURL: opts.baseURL,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: false,
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 10,
      customRules: {
        "/sign-in/email": { window: 60, max: 10 },
        "/sign-up/email": { window: 60, max: 10 },
      },
    },
    cookies: {
      session: {
        attributes: {
          sameSite: "lax",
          secure: isProd,
          httpOnly: true,
        },
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
export type Session = NonNullable<Auth["$Infer"]["Session"]>["session"];
export type User = NonNullable<Auth["$Infer"]["Session"]>["user"];
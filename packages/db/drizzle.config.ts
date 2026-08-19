import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL ?? "file:./local.db";
const isRemote = databaseUrl.startsWith("libsql://") || databaseUrl.startsWith("https://");
const authToken = process.env.DATABASE_AUTH_TOKEN;

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "sqlite",
  ...(isRemote ? { driver: "turso" } : {}),
  dbCredentials: isRemote
    ? { url: databaseUrl, authToken }
    : { url: databaseUrl },
});

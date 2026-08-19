import { serve } from "@hono/node-server";
import { createDb } from "@axioma/db";
import { loadEnv } from "./env.ts";
import { createAuth } from "./auth/auth.ts";
import { makeDeps } from "./services/deps.ts";
import { createMpClient } from "./services/mercadopago.ts";
import { createApp } from "./index.ts";

const env = loadEnv();
const { db } = await createDb({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });
const auth = createAuth(db, {
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  nodeEnv: env.NODE_ENV,
});
const mp = createMpClient(env.MP_ACCESS_TOKEN);
const deps = makeDeps(db, auth, mp);
const app = createApp({ env, deps });

const PORT = Number(process.env.PORT ?? env.PORT ?? 3000);

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`[api] listening on http://localhost:${info.port}`);
});
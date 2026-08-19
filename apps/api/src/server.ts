import { serve } from "@hono/node-server";
import { loadEnv } from "./env.ts";
import { makeDeps } from "./services/deps.ts";
import { createApp } from "./index.ts";

const env = loadEnv();
const deps = await makeDeps(env.DATABASE_URL, env.DATABASE_AUTH_TOKEN);
const app = createApp({ env, deps });

const PORT = Number(process.env.PORT ?? env.PORT ?? 3000);

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`[api] listening on http://localhost:${info.port}`);
});

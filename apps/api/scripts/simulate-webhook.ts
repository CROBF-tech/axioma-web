import { request as httpRequest, type IncomingMessage } from "node:http";
import { request as httpsRequest } from "node:https";

const API_URL = process.env.API_URL ?? "http://localhost:3000";
const PREAPPROVAL_ID = process.env.MP_PREAPPROVAL_ID ?? "test-preapproval-id";

type Subcommand = "authorized" | "payment_failed" | "cancelled";

function buildPayload(subcommand: Subcommand) {
  return {
    type: subcommand,
    data: { id: PREAPPROVAL_ID },
  };
}

function post(
  url: string,
  body: string,
  headers: Record<string, string>,
): Promise<{ status: number; text: string }> {
  const u = new URL(url);
  const lib = u.protocol === "https:" ? httpsRequest : httpRequest;
  return new Promise((resolve, reject) => {
    const req = lib(
      {
        hostname: u.hostname,
        port: Number(u.port || (u.protocol === "https:" ? 443 : 80)),
        path: u.pathname,
        method: "POST",
        headers: { "content-type": "application/json", ...headers },
      },
      (res: IncomingMessage) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve({ status: res.statusCode ?? 0, text: data }));
      },
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const arg = process.argv[2] as Subcommand | undefined;
  if (!arg || !["authorized", "payment_failed", "cancelled"].includes(arg)) {
    console.error("Uso: tsx scripts/simulate-webhook.ts <authorized|payment_failed|cancelled>");
    process.exit(1);
  }
  const payload = buildPayload(arg);
  const res = await post(`${API_URL}/webhooks/mp`, JSON.stringify(payload), {
    "x-dev-bypass": "1",
  });
  console.log(`status=${res.status} body=${res.text}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
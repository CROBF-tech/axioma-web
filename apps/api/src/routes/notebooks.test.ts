import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Hono } from "hono";
import { eq, sql } from "drizzle-orm";
import { createDb } from "@axioma/db";
import { notebooks as notebooksTable } from "@axioma/db/schema";
import { createNotebooksRouter } from "./notebooks.ts";
import { requireAuth } from "../middleware/require-auth.ts";
import type { AppEnv } from "../index.ts";
import type { ApiDeps } from "../services/deps.ts";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdtempSync, rmSync } from "node:fs";

interface MockUser {
  id: string;
  email: string;
  name: string;
}

type CreatedDb = Awaited<ReturnType<typeof createDb>>;
let testDir = "";
let testUrl = "";

async function ensureSchema(db: CreatedDb["db"]): Promise<void> {
  await db.run(
    sql`CREATE TABLE IF NOT EXISTS notebooks (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      title TEXT NOT NULL,
      folder_id TEXT,
      accent TEXT,
      is_public INTEGER NOT NULL DEFAULT 0,
      public_slug TEXT UNIQUE,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`,
  );
  await db.run(
    sql`CREATE TABLE IF NOT EXISTS cells (
      id TEXT PRIMARY KEY,
      notebook_id TEXT NOT NULL,
      order_idx INTEGER NOT NULL,
      kind TEXT NOT NULL,
      input TEXT NOT NULL,
      output TEXT,
      "references" TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (notebook_id) REFERENCES notebooks(id) ON DELETE CASCADE
    )`,
  );
}

function makeDeps(db: ApiDeps["db"], user: MockUser | null): ApiDeps {
  return {
    db,
    auth: {
      api: {
        getSession: async () =>
          user
            ? { session: { id: "s1" }, user: { id: user.id, email: user.email, name: user.name } }
            : null,
      },
      handler: (_req: Request) =>
        Promise.resolve(
          new Response("{}", { status: 200, headers: { "content-type": "application/json" } }),
        ),
    } as unknown as ApiDeps["auth"],
    mp: {} as unknown as ApiDeps["mp"],
  };
}

function makeApp(deps: ApiDeps): Hono<AppEnv> {
  const app = new Hono<AppEnv>();
  app.use("*", requireAuth(deps.auth));
  app.route("/api/notebooks", createNotebooksRouter(deps));
  return app;
}

describe("notebooks router", () => {
  let db!: ApiDeps["db"];
  let client!: CreatedDb["client"];

  beforeAll(async () => {
    testDir = mkdtempSync(join(tmpdir(), "axioma-nb-test-"));
    testUrl = `file:${join(testDir, "test.db")}`;
    const created = await createDb({ url: testUrl });
    db = created.db;
    client = created.client;
    await ensureSchema(db);
  });

  afterAll(async () => {
    await client.close();
    rmSync(testDir, { recursive: true, force: true });
  });

  it("POST /api/notebooks sin auth responde 401", async () => {
    const deps = makeDeps(db, null);
    const app = makeApp(deps);
    const res = await app.request("/api/notebooks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Sin auth" }),
    });
    expect(res.status).toBe(401);
  });

  it("POST /api/notebooks con auth responde 201 y crea el notebook", async () => {
    const deps = makeDeps(db, { id: "user-1", email: "a@b.c", name: "Test" });
    const app = makeApp(deps);
    const res = await app.request("/api/notebooks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Mi notebook", accent: "#6366f1" }),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as {
      id: string;
      ownerId: string;
      title: string;
      accent: string | null;
      isPublic: boolean;
    };
    expect(body.title).toBe("Mi notebook");
    expect(body.ownerId).toBe("user-1");
    expect(body.accent).toBe("#6366f1");
    expect(body.isPublic).toBe(false);
    expect(typeof body.id).toBe("string");

    const rows = await db.select().from(notebooksTable).where(eq(notebooksTable.id, body.id));
    expect(rows.length).toBe(1);
  });

  it("GET /api/notebooks/:id inexistente responde 404", async () => {
    const deps = makeDeps(db, { id: "user-1", email: "a@b.c", name: "Test" });
    const app = makeApp(deps);
    const res = await app.request("/api/notebooks/no-existe-id");
    expect(res.status).toBe(404);
    const body = (await res.json()) as { code: string };
    expect(body.code).toBe("NOT_FOUND");
  });

  it("POST /api/notebooks con body inválido responde 400", async () => {
    const deps = makeDeps(db, { id: "user-1", email: "a@b.c", name: "Test" });
    const app = makeApp(deps);
    const res = await app.request("/api/notebooks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: 123 }),
    });
    expect(res.status).toBe(400);
  });

  it("GET /api/notebooks/:id con notebook ajeno responde 404", async () => {
    const deps = makeDeps(db, { id: "user-2", email: "b@c.d", name: "Other" });
    const app = makeApp(deps);
    const res = await app.request("/api/notebooks/notebook-user-1");
    expect(res.status).toBe(404);
  });
});
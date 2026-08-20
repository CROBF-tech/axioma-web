import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest"
import { Hono } from "hono"
import { sql } from "drizzle-orm"
import { createDb } from "@axioma/db"
import { cells as cellsTable, notebooks as notebooksTable } from "@axioma/db/schema"
import { createPublicRouter } from "./public.ts"
import type { AppEnv } from "../index.ts"
import type { ApiDeps } from "../services/deps.ts"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { mkdtempSync, rmSync } from "node:fs"

type CreatedDb = Awaited<ReturnType<typeof createDb>>
let testDir = ""
let testUrl = ""

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
  )
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
  )
}

function makeDeps(db: CreatedDb["db"]): ApiDeps {
  return {
    db,
    auth: {
      api: {
        getSession: async () => null,
      },
      handler: (_req: Request) =>
        Promise.resolve(
          new Response("{}", { status: 200, headers: { "content-type": "application/json" } }),
        ),
    } as unknown as ApiDeps["auth"],
    mp: {} as unknown as ApiDeps["mp"],
  }
}

function makeApp(deps: ApiDeps): Hono<AppEnv> {
  const app = new Hono<AppEnv>()
  app.route("/public", createPublicRouter(deps))
  return app
}

describe("public router", () => {
  let db!: CreatedDb["db"]
  let client!: CreatedDb["client"]

  beforeAll(async () => {
    testDir = mkdtempSync(join(tmpdir(), "axioma-public-"))
    testUrl = `file:${join(testDir, "test.db")}`
    const created = await createDb({ url: testUrl })
    db = created.db
    client = created.client
  })



  afterEach(async () => {
    await db.run(sql`DELETE FROM cells`)
    await db.run(sql`DELETE FROM notebooks`)
  })

  afterAll(async () => {
    await client.close()
    rmSync(testDir, { recursive: true, force: true })
  })

  it("GET /public/notebooks/:slug con slug inválido responde 404", async () => {
    await ensureSchema(db)
    const deps = makeDeps(db)
    const app = makeApp(deps)
    const res = await app.request("/public/notebooks/INVALID_SLUG")
    expect(res.status).toBe(404)
    const body = (await res.json()) as { error: string; code: string }
    expect(body.code).toBe("NOT_FOUND")
  })

  it("GET /public/notebooks/:slug que no existe responde 404", async () => {
    await ensureSchema(db)
    const deps = makeDeps(db)
    const app = makeApp(deps)
    const res = await app.request("/public/notebooks/abcdefghijklmnopqrstuv")
    expect(res.status).toBe(404)
    const body = (await res.json()) as { error: string; code: string }
    expect(body.code).toBe("NOT_FOUND")
  })

  it("GET /public/notebooks/:slug con isPublic=false responde 404", async () => {
    await ensureSchema(db)
    await db.insert(notebooksTable).values({
      id: "nb-1",
      ownerId: "user-1",
      title: "Private Notebook",
      folderId: null,
      accent: null,
      isPublic: false,
      publicSlug: "abcdefghijklmnopqrstuv",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    const deps = makeDeps(db)
    const app = makeApp(deps)
    const res = await app.request("/public/notebooks/abcdefghijklmnopqrstuv")
    expect(res.status).toBe(404)
    const body = (await res.json()) as { error: string; code: string }
    expect(body.code).toBe("NOT_FOUND")
  })

  it("GET /public/notebooks/:slug happy path responde 200 con cells ordenadas", async () => {
    await ensureSchema(db)
    await db.insert(notebooksTable).values({
      id: "nb-1",
      ownerId: "user-1",
      title: "Public Notebook",
      folderId: null,
      accent: "#10b981",
      isPublic: true,
      publicSlug: "abcdefghijklmnopqrstuv",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await db.insert(cellsTable).values([
      {
        id: "cell-3",
        notebookId: "nb-1",
        orderIdx: 2,
        kind: "text",
        input: "## Conclusion",
        output: null,
        references: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cell-1",
        notebookId: "nb-1",
        orderIdx: 0,
        kind: "math",
        input: "x^2",
        output: null,
        references: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cell-2",
        notebookId: "nb-1",
        orderIdx: 1,
        kind: "plot",
        input: "f(x)=x^2",
        output: null,
        references: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    const deps = makeDeps(db)
    const app = makeApp(deps)
    const res = await app.request("/public/notebooks/abcdefghijklmnopqrstuv")
    expect(res.status).toBe(200)
    const body = (await res.json()) as {
      notebook: { id: string; title: string; accent: string | null }
      cells: Array<{ id: string; orderIdx: number }>
    }
    expect(body.notebook.id).toBe("nb-1")
    expect(body.notebook.title).toBe("Public Notebook")
    expect(body.notebook.accent).toBe("#10b981")
    expect(body.cells.length).toBe(3)
    expect(body.cells[0]?.id).toBe("cell-1")
    expect(body.cells[1]?.id).toBe("cell-2")
    expect(body.cells[2]?.id).toBe("cell-3")
    expect(body.cells[0]?.orderIdx).toBe(0)
    expect(body.cells[1]?.orderIdx).toBe(1)
    expect(body.cells[2]?.orderIdx).toBe(2)
  })
})

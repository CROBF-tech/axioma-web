import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import { createShareRouter } from "./share.ts";
import { requireAuth } from "../middleware/require-auth.ts";
import type { AppEnv } from "../index.ts";
import type { ApiDeps } from "../services/deps.ts";

interface MockUser {
  id: string;
  email: string;
  name: string;
}

interface NotebookRow {
  id: string;
  ownerId: string;
  title: string;
  folderId: string | null;
  accent: string | null;
  isPublic: boolean;
  publicSlug: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function dbColumnToJsField(columnName: string): string {
  return columnName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function extractConditionsFromSQL(sqlObj: unknown): Array<{ field: string; value: unknown }> {
  const conditions: Array<{ field: string; value: unknown }> = [];
  if (!sqlObj || typeof sqlObj !== "object") return conditions;
  const obj = sqlObj as Record<string, unknown>;
  if ("queryChunks" in obj && Array.isArray(obj.queryChunks)) {
    const chunks = obj.queryChunks;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (chunk && typeof chunk === "object") {
        const chunkObj = chunk as Record<string, unknown>;
        if ("queryChunks" in chunkObj) {
          conditions.push(...extractConditionsFromSQL(chunkObj));
        } else if ("name" in chunkObj && typeof chunkObj.name === "string") {
          const dbColumnName = chunkObj.name as string;
          const fieldName = dbColumnToJsField(dbColumnName);
          let value: unknown;
          for (let j = i + 1; j < chunks.length; j++) {
            const nextChunk = chunks[j];
            if (nextChunk && typeof nextChunk === "object") {
              const nextObj = nextChunk as Record<string, unknown>;
              if ("value" in nextObj && !("name" in nextObj) && "encoder" in nextObj) {
                value = nextObj.value;
                break;
              }
            }
          }
          if (value !== undefined) {
            conditions.push({ field: fieldName, value });
          }
        }
      }
    }
  }
  return conditions;
}

function evaluateCondition(clause: unknown, row: NotebookRow): boolean {
  if (!clause) return true;
  const conditions = extractConditionsFromSQL(clause);
  for (const cond of conditions) {
    if (cond.field in row) {
      if ((row as unknown as Record<string, unknown>)[cond.field] !== cond.value) {
        return false;
      }
    }
  }
  return true;
}

class FakeDb {
  notebooks: NotebookRow[] = [];

  select(columns?: Record<string, unknown>) {
    const db = this;
    const selectedColumns = columns;
    return {
      from(_table: unknown) {
        return {
          where(clause: unknown) {
            const filtered = db.notebooks.filter((row) => evaluateCondition(clause, row));
            return {
              async then(resolve: (rows: unknown[]) => void) {
                if (selectedColumns) {
                  resolve(
                    filtered.map((nb) => {
                      const result: Record<string, unknown> = {};
                      for (const key of Object.keys(selectedColumns)) {
                        result[key] = (nb as unknown as Record<string, unknown>)[key];
                      }
                      return result;
                    }),
                  );
                } else {
                  resolve(filtered);
                }
              },
            };
          },
          async then(resolve: (rows: unknown[]) => void) {
            resolve(db.notebooks);
          },
        };
      },
    };
  }

  update(_table: unknown) {
    const db = this;
    return {
      set(data: Partial<NotebookRow>) {
        return {
          where(clause: unknown) {
            const filtered = db.notebooks.filter((row) => evaluateCondition(clause, row));
            for (const nb of filtered) {
              Object.assign(nb, data);
            }
            return Promise.resolve(undefined);
          },
        };
      },
    };
  }
}

function makeDeps(
  db: FakeDb,
  user: MockUser | null,
): ApiDeps {
  return {
    db: db as unknown as ApiDeps["db"],
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
  app.route("/api", createShareRouter(deps, { webUrl: "http://localhost:5173" }));
  return app;
}

describe("share router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST /api/notebooks/:id/share sin auth responde 401", async () => {
    const db = new FakeDb();
    const deps = makeDeps(db, null);
    const app = makeApp(deps);
    const res = await app.request("/api/notebooks/nb-1/share", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enabled: true }),
    });
    expect(res.status).toBe(401);
  });

  it("POST /api/notebooks/:id/share con notebook inexistente responde 404", async () => {
    const db = new FakeDb();
    const deps = makeDeps(db, { id: "user-1", email: "a@b.c", name: "Test" });
    const app = makeApp(deps);
    const res = await app.request("/api/notebooks/nb-no-exists/share", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enabled: true }),
    });
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error: string; code: string };
    expect(body.code).toBe("NOT_FOUND");
  });

  it("POST /api/notebooks/:id/share con body inválido responde 400", async () => {
    const db = new FakeDb();
    const deps = makeDeps(db, { id: "user-1", email: "a@b.c", name: "Test" });
    const app = makeApp(deps);
    const res = await app.request("/api/notebooks/nb-1/share", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enabled: "yes" }),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string; code: string };
    expect(body.code).toBe("VALIDATION");
  });

  it("POST /api/notebooks/:id/share con notebook inexistente responde 404 (2)", async () => {
    const db = new FakeDb();
    const deps = makeDeps(db, { id: "user-1", email: "a@b.c", name: "Test" });
    const app = makeApp(deps);
    const res = await app.request("/api/notebooks/nb-not-exists/share", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enabled: true }),
    });
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error: string; code: string };
    expect(body.code).toBe("NOT_FOUND");
  });

  it("POST /api/notebooks/:id/share de otro usuario responde 404", async () => {
    const db = new FakeDb();
    db.notebooks.push({
      id: "nb-1",
      ownerId: "user-other",
      title: "Other Notebook",
      folderId: null,
      accent: null,
      isPublic: false,
      publicSlug: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const deps = makeDeps(db, { id: "user-1", email: "a@b.c", name: "Test" });
    const app = makeApp(deps);
    const res = await app.request("/api/notebooks/nb-1/share", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enabled: true }),
    });
    expect(res.status).toBe(404);
  });

  it("POST /api/notebooks/:id/share con enabled:true genera slug", async () => {
    const db = new FakeDb();
    db.notebooks.push({
      id: "nb-1",
      ownerId: "user-1",
      title: "My Notebook",
      folderId: null,
      accent: "#6366f1",
      isPublic: false,
      publicSlug: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const deps = makeDeps(db, { id: "user-1", email: "a@b.c", name: "Test" });
    const app = makeApp(deps);
    const res = await app.request("/api/notebooks/nb-1/share", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enabled: true }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      isPublic: boolean;
      publicSlug: string;
      publicUrl: string;
    };
    expect(body.isPublic).toBe(true);
    expect(typeof body.publicSlug).toBe("string");
    expect(body.publicSlug.length).toBeGreaterThan(0);
    expect(body.publicUrl).toContain(body.publicSlug);
    const updated = db.notebooks.find((n) => n.id === "nb-1");
    expect(updated?.isPublic).toBe(true);
    expect(updated?.publicSlug).toBe(body.publicSlug);
  });

  it("POST /api/notebooks/:id/share con enabled:false disable sharing", async () => {
    const db = new FakeDb();
    db.notebooks.push({
      id: "nb-1",
      ownerId: "user-1",
      title: "My Notebook",
      folderId: null,
      accent: "#6366f1",
      isPublic: true,
      publicSlug: "existing-slug",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const deps = makeDeps(db, { id: "user-1", email: "a@b.c", name: "Test" });
    const app = makeApp(deps);
    const res = await app.request("/api/notebooks/nb-1/share", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enabled: false }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      isPublic: boolean;
      publicSlug: null;
      publicUrl: null;
    };
    expect(body.isPublic).toBe(false);
    expect(body.publicSlug).toBeNull();
    expect(body.publicUrl).toBeNull();
    const updated = db.notebooks.find((n) => n.id === "nb-1");
    expect(updated?.isPublic).toBe(false);
    expect(updated?.publicSlug).toBeNull();
  });
});

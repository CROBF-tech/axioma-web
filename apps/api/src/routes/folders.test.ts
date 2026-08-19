import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { folders as foldersTable } from "@axioma/db/schema";
import type { Folder } from "@axioma/shared";
import { createFoldersRouter } from "./folders.ts";
import { requireAuth } from "../middleware/require-auth.ts";
import type { AppEnv } from "../index.ts";
import type { ApiDeps } from "../services/deps.ts";

type FolderRow = typeof foldersTable.$inferSelect;

class FakeDb {
  folders: FolderRow[] = [];
  deletedFolderIds = new Set<string>();
  updatedFolderIds = new Set<string>();

  select() {
    const db = this;
    return {
      from(_table: unknown) {
        return {
          where(_clause: unknown) {
            return {
              orderBy(_o: unknown) {
                return Promise.resolve(db.folders);
              },
              async then(resolve: (rows: FolderRow[]) => void) {
                resolve(db.folders);
              },
            };
          },
          async then(resolve: (rows: FolderRow[]) => void) {
            resolve(db.folders);
          },
        };
      },
    };
  }

  insert(_table: unknown) {
    const db = this;
    return {
      values(rows: FolderRow | FolderRow[]) {
        const arr = Array.isArray(rows) ? rows : [rows];
        for (const r of arr) db.folders.push(r);
        return Promise.resolve(undefined);
      },
    };
  }

  update(_table: unknown) {
    const db = this;
    return {
      set(data: Partial<FolderRow>) {
        return {
          where(_clause: unknown) {
            for (const r of db.folders) Object.assign(r, data);
            return Promise.resolve(undefined);
          },
        };
      },
    };
  }

  delete(_table: unknown) {
    const db = this;
    return {
      where(_clause: unknown) {
        db.folders = db.folders.filter((r) => !db.deletedFolderIds.has(r.id));
        return Promise.resolve(undefined);
      },
    };
  }
}

function makeDeps(db: FakeDb, user: { id: string; email: string; name: string } | null): ApiDeps {
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
  app.route("/api/folders", createFoldersRouter(deps));
  return app;
}

describe("folders router", () => {
  it("GET /api/folders sin auth responde 401", async () => {
    const db = new FakeDb();
    const deps = makeDeps(db, null);
    const app = makeApp(deps);
    const res = await app.request("/api/folders");
    expect(res.status).toBe(401);
  });

  it("POST /api/folders con body válido responde 201 y crea el folder", async () => {
    const db = new FakeDb();
    const deps = makeDeps(db, { id: "user-1", email: "a@b.c", name: "Test" });
    const app = makeApp(deps);
    const res = await app.request("/api/folders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Mi folder", parentId: null }),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as Folder;
    expect(body.name).toBe("Mi folder");
    expect(body.ownerId).toBe("user-1");
    expect(body.parentId).toBeNull();
    expect(typeof body.id).toBe("string");
    expect(db.folders.length).toBe(1);
    expect(db.folders[0]?.name).toBe("Mi folder");
  });
});
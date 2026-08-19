import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { subscriptions as subscriptionsTable } from "@axioma/db/schema";
import type { SubscriptionRow } from "@axioma/db";
import { createBillingRouter } from "./billing.ts";
import type { AppEnv } from "../index.ts";
import type { ApiDeps } from "../services/deps.ts";

type SubRow = SubscriptionRow;

interface MockUser {
  id: string;
  email: string;
  name: string;
}

class FakeDb {
  subscriptions: SubRow[] = [];

  select() {
    const db = this;
    return {
      from(_table: unknown) {
        return {
          where(_clause: unknown) {
            return {
              limit(_n: number) {
                return {
                  async then(resolve: (rows: SubRow[]) => void) {
                    resolve(db.subscriptions);
                  },
                };
              },
              async then(resolve: (rows: SubRow[]) => void) {
                resolve(db.subscriptions);
              },
            };
          },
          async then(resolve: (rows: SubRow[]) => void) {
            resolve(db.subscriptions);
          },
        };
      },
    };
  }

  insert(table: unknown) {
    const db = this;
    return {
      values(row: SubRow) {
        if (table === subscriptionsTable) db.subscriptions.push(row);
        return Promise.resolve(undefined);
      },
    };
  }

  update(table: unknown) {
    const db = this;
    return {
      set(data: Partial<SubRow>) {
        return {
          where(_clause: unknown) {
            if (table === subscriptionsTable) {
              for (const r of db.subscriptions) Object.assign(r, data);
            }
            return Promise.resolve(undefined);
          },
        };
      },
    };
  }
}

function makeDeps(db: FakeDb, user: MockUser | null): ApiDeps {
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
    mp: {
      preapproval: {
        create: async () => ({ id: "mp-123", init_point: "https://mp.test/init" }),
        update: async () => ({ id: "mp-123", status: "cancelled" }),
      },
    } as unknown as ApiDeps["mp"],
  };
}

function makeApp(deps: ApiDeps): Hono<AppEnv> {
  const app = new Hono<AppEnv>();
  app.route("/billing", createBillingRouter({
    db: deps.db,
    auth: deps.auth,
    mp: deps.mp,
    webUrl: "http://localhost:5173",
  }));
  return app;
}

describe("billing router", () => {
  it("POST /billing/checkout sin auth responde 401", async () => {
    const db = new FakeDb();
    const deps = makeDeps(db, null);
    const app = makeApp(deps);
    const res = await app.request("/billing/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan: "monthly" }),
    });
    expect(res.status).toBe(401);
  });

  it("GET /billing/status sin auth responde 401", async () => {
    const db = new FakeDb();
    const deps = makeDeps(db, null);
    const app = makeApp(deps);
    const res = await app.request("/billing/status");
    expect(res.status).toBe(401);
  });

  it("GET /billing/status con sub inexistente responde 200 con status none", async () => {
    const db = new FakeDb();
    const deps = makeDeps(db, { id: "user-1", email: "a@b.c", name: "Test" });
    const app = makeApp(deps);
    const res = await app.request("/billing/status");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; plan: unknown; current_period_end: unknown };
    expect(body.status).toBe("none");
    expect(body.plan).toBeNull();
    expect(body.current_period_end).toBeNull();
  });

  it("POST /billing/checkout con sub inexistente crea preapproval y devuelve init_point", async () => {
    const db = new FakeDb();
    const deps = makeDeps(db, { id: "user-1", email: "a@b.c", name: "Test" });
    const app = makeApp(deps);
    const res = await app.request("/billing/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan: "monthly" }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { init_point: string };
    expect(body.init_point).toBe("https://mp.test/init");
    expect(db.subscriptions.length).toBe(1);
    expect(db.subscriptions[0]?.status).toBe("pending");
    expect(db.subscriptions[0]?.mpPreapprovalId).toBe("mp-123");
  });

  it("POST /billing/checkout con body inválido responde 400", async () => {
    const db = new FakeDb();
    const deps = makeDeps(db, { id: "user-1", email: "a@b.c", name: "Test" });
    const app = makeApp(deps);
    const res = await app.request("/billing/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan: "invalid" }),
    });
    expect(res.status).toBe(400);
  });

  it("GET /billing/status con sub activa devuelve datos", async () => {
    const db = new FakeDb();
    const end = new Date();
    end.setUTCMonth(end.getUTCMonth() + 1);
    db.subscriptions.push({
      id: "sub-1",
      userId: "user-1",
      plan: "monthly",
      status: "active",
      mpPreapprovalId: "mp-123",
      currentPeriodEnd: end,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const deps = makeDeps(db, { id: "user-1", email: "a@b.c", name: "Test" });
    const app = makeApp(deps);
    const res = await app.request("/billing/status");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; plan: string; current_period_end: string };
    expect(body.status).toBe("active");
    expect(body.plan).toBe("monthly");
    expect(typeof body.current_period_end).toBe("string");
  });
});
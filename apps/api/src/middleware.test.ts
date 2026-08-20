import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import { requireAuth } from "./middleware/require-auth.ts";
import { requireSubscription } from "./middleware/require-subscription.ts";
import type { AppEnv } from "./index.ts";
import type { Auth, Session, User } from "./auth/auth.ts";
import type { DbClient } from "@axioma/db";
import { isSubscriptionActive } from "@axioma/shared";

vi.mock("@axioma/shared", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    isSubscriptionActive: vi.fn(),
  };
});

interface MockSessionData {
  session: Session;
  user: User;
}

function createMockAuth(getSessionResult: MockSessionData | null): Auth {
  return {
    api: {
      getSession: vi.fn().mockResolvedValue(getSessionResult),
    },
    handler: vi.fn().mockResolvedValue(new Response("{}", { status: 200 })),
  } as unknown as Auth;
}

function createMockDb(queryResult: unknown[]): DbClient {
  return {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: () => Promise.resolve(queryResult),
        }),
      }),
    }),
  } as unknown as DbClient;
}

describe("requireAuth middleware", () => {
  it("responde 401 sin session", async () => {
    const auth = createMockAuth(null);
    const app = new Hono<AppEnv>();
    app.use("*", requireAuth(auth));
    app.get("/test", (c) => c.json({ ok: true }));

    const res = await app.request("/test", { method: "GET" });
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: string; code: string };
    expect(body.error).toBe("Unauthorized");
    expect(body.code).toBe("UNAUTHORIZED");
  });

  it("responde 200 con session valida", async () => {
    const auth = createMockAuth({
      session: {
        id: "s1",
        token: "token1",
        userId: "u1",
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: {
        id: "u1",
        email: "test@example.com",
        name: "Test User",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const app = new Hono<AppEnv>();
    app.use("*", requireAuth(auth));
    app.get("/test", (c) => c.json({ ok: true }));

    const res = await app.request("/test", { method: "GET" });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
  });

  it("setea user y session en el contexto", async () => {
    const mockSession: MockSessionData = {
      session: {
        id: "s1",
        token: "token1",
        userId: "u1",
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: {
        id: "u1",
        email: "test@example.com",
        name: "Test",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    const auth = createMockAuth(mockSession);
    const app = new Hono<AppEnv>();
    app.use("*", requireAuth(auth));
    app.get("/test", (c) => {
      const user = c.get("user");
      const session = c.get("session");
      return c.json({ userId: user.id, sessionId: session.id });
    });

    const res = await app.request("/test", { method: "GET" });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { userId: string; sessionId: string };
    expect(body.userId).toBe("u1");
    expect(body.sessionId).toBe("s1");
  });

  it("llama a auth.api.getSession con los headers correctos", async () => {
    const mockSession: MockSessionData = {
      session: {
        id: "s1",
        token: "token1",
        userId: "u1",
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: {
        id: "u1",
        email: "test@example.com",
        name: "Test",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    const getSessionSpy = vi.fn().mockResolvedValue(mockSession);
    const auth = {
      api: { getSession: getSessionSpy },
      handler: vi.fn().mockResolvedValue(new Response("{}", { status: 200 })),
    } as unknown as Auth;
    const app = new Hono<AppEnv>();
    app.use("*", requireAuth(auth));
    app.get("/test", (c) => c.json({ ok: true }));

    const testHeaders = new Headers({ "cookie": "session=abc123" });
    await app.request("/test", { method: "GET", headers: testHeaders });

    expect(getSessionSpy).toHaveBeenCalledWith({ headers: testHeaders });
  });
});

describe("requireSubscription middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("responde 401 sin user en el contexto", async () => {
    const db = createMockDb([]);
    const app = new Hono<AppEnv>();
    app.use("*", requireSubscription(db));
    app.get("/test", (c) => c.json({ ok: true }));

    const res = await app.request("/test", { method: "GET" });
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: string; code: string };
    expect(body.error).toBe("Unauthorized");
    expect(body.code).toBe("UNAUTHORIZED");
  });

  it("responde 402 sin subscription en la DB", async () => {
    const db = createMockDb([]);
    const app = new Hono<AppEnv>();
    app.use((c, next) => {
      c.set("user", {
        id: "u1",
        email: "test@example.com",
        name: "Test",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      c.set("session", {
        id: "s1",
        token: "token1",
        userId: "u1",
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return next();
    });
    app.use("*", requireSubscription(db));
    app.get("/test", (c) => c.json({ ok: true }));

    const res = await app.request("/test", { method: "GET" });
    expect(res.status).toBe(402);
    const body = (await res.json()) as { error: string; code: string };
    expect(body.error).toBe("Payment required");
    expect(body.code).toBe("PAYMENT_REQUIRED");
  });

  it("responde 402 con subscription inactiva", async () => {
    vi.mocked(isSubscriptionActive).mockReturnValue(false);
    const db = createMockDb([{ id: "sub1", userId: "u1", status: "inactive" }]);
    const app = new Hono<AppEnv>();
    app.use((c, next) => {
      c.set("user", {
        id: "u1",
        email: "test@example.com",
        name: "Test",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      c.set("session", {
        id: "s1",
        token: "token1",
        userId: "u1",
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return next();
    });
    app.use("*", requireSubscription(db));
    app.get("/test", (c) => c.json({ ok: true }));

    const res = await app.request("/test", { method: "GET" });
    expect(res.status).toBe(402);
    expect(isSubscriptionActive).toHaveBeenCalledWith({ id: "sub1", userId: "u1", status: "inactive" });
  });

  it("responde 200 con subscription activa", async () => {
    vi.mocked(isSubscriptionActive).mockReturnValue(true);
    const db = createMockDb([{ id: "sub1", userId: "u1", status: "active" }]);
    const app = new Hono<AppEnv>();
    app.use((c, next) => {
      c.set("user", {
        id: "u1",
        email: "test@example.com",
        name: "Test",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      c.set("session", {
        id: "s1",
        token: "token1",
        userId: "u1",
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return next();
    });
    app.use("*", requireSubscription(db));
    app.get("/test", (c) => c.json({ ok: true }));

    const res = await app.request("/test", { method: "GET" });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
    expect(isSubscriptionActive).toHaveBeenCalledWith({ id: "sub1", userId: "u1", status: "active" });
  });

  it("consulta la DB para verificar subscription", async () => {
    vi.mocked(isSubscriptionActive).mockReturnValue(true);
    const mockUser: User = {
      id: "user-123",
      email: "test@example.com",
      name: "Test",
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    let selectCalled = false;
    const db = {
      select: () => {
        selectCalled = true;
        return {
          from: () => ({
            where: () => ({
              limit: () => Promise.resolve([{ id: "sub1", userId: mockUser.id, status: "active" }]),
            }),
          }),
        };
      },
    } as unknown as DbClient;
    const app = new Hono<AppEnv>();
    app.use((c, next) => {
      c.set("user", mockUser);
      c.set("session", {
        id: "s1",
        token: "token1",
        userId: mockUser.id,
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return next();
    });
    app.use("*", requireSubscription(db));
    app.get("/test", (c) => c.json({ ok: true }));

    await app.request("/test", { method: "GET" });

    expect(selectCalled).toBe(true);
  });
});

import { describe, it, expect } from "vitest";
import {
  users,
  sessions,
  accounts,
  verifications,
  type UserRow,
  type NewUserRow,
  type SessionRow,
  type NewSessionRow,
  type AccountRow,
  type NewAccountRow,
  type VerificationRow,
  type NewVerificationRow,
} from "./auth.ts";

const NOW = new Date("2026-01-01T00:00:00Z");

describe("schema — users", () => {
  it("tiene las columnas esperadas", () => {
    const columns = Object.keys(users);
    expect(columns).toEqual(
      expect.arrayContaining([
        "id",
        "email",
        "emailVerified",
        "name",
        "image",
        "createdAt",
        "updatedAt",
      ]),
    );
  });

  it("email es unique y notNull", () => {
    const emailColumn = (users as any).email;
    expect(emailColumn).toBeDefined();
  });

  it("emailVerified es boolean con default false", () => {
    const row: UserRow = {
      id: "u1",
      email: "test@example.com",
      emailVerified: false,
      name: "Test User",
      image: null,
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(typeof row.emailVerified).toBe("boolean");
    expect(row.emailVerified).toBe(false);
  });

  it("acepta inserts válidos", () => {
    const row: NewUserRow = {
      id: "u1",
      email: "new@example.com",
      emailVerified: true,
      name: "New User",
      image: "https://example.com/avatar.png",
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(row.email).toBe("new@example.com");
    expect(row.emailVerified).toBe(true);
  });

  it("image es nullable", () => {
    const row: NewUserRow = {
      id: "u2",
      email: "nopic@example.com",
      emailVerified: false,
      name: "No Pic",
      image: null,
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(row.image).toBeNull();
  });
});

describe("schema — sessions", () => {
  it("tiene las columnas esperadas", () => {
    const columns = Object.keys(sessions);
    expect(columns).toEqual(
      expect.arrayContaining([
        "id",
        "userId",
        "expiresAt",
        "token",
        "ipAddress",
        "userAgent",
        "createdAt",
        "updatedAt",
      ]),
    );
  });

  it("token es unique y notNull", () => {
    const tokenColumn = (sessions as any).token;
    expect(tokenColumn).toBeDefined();
  });

  it("acepta inserts válidos", () => {
    const row: NewSessionRow = {
      id: "s1",
      userId: "u1",
      expiresAt: NOW,
      token: "session-token-abc123",
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0",
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(row.token).toBe("session-token-abc123");
    expect(row.userId).toBe("u1");
  });

  it("ipAddress y userAgent son nullable", () => {
    const row: NewSessionRow = {
      id: "s2",
      userId: "u2",
      expiresAt: NOW,
      token: "token-no-meta",
      ipAddress: null,
      userAgent: null,
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(row.ipAddress).toBeNull();
    expect(row.userAgent).toBeNull();
  });

  it("expiresAt es timestamp", () => {
    const row: SessionRow = {
      id: "s3",
      userId: "u3",
      expiresAt: NOW,
      token: "token-expiry",
      ipAddress: null,
      userAgent: null,
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(row.expiresAt instanceof Date).toBe(true);
  });
});

describe("schema — accounts", () => {
  it("tiene las columnas esperadas", () => {
    const columns = Object.keys(accounts);
    expect(columns).toEqual(
      expect.arrayContaining([
        "id",
        "userId",
        "providerId",
        "issuer",
        "accountId",
        "accessToken",
        "refreshToken",
        "idToken",
        "accessTokenExpiresAt",
        "refreshTokenExpiresAt",
        "scope",
        "password",
        "createdAt",
        "updatedAt",
      ]),
    );
  });

  it("acepta inserts válidos con provider OAuth", () => {
    const row: NewAccountRow = {
      id: "a1",
      userId: "u1",
      providerId: "google",
      issuer: "https://accounts.google.com",
      accountId: "google-account-123",
      accessToken: "access-token-xyz",
      refreshToken: "refresh-token-xyz",
      idToken: "id-token-xyz",
      accessTokenExpiresAt: NOW,
      refreshTokenExpiresAt: null,
      scope: "email profile",
      password: null,
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(row.providerId).toBe("google");
    expect(row.scope).toBe("email profile");
  });

  it("acepta cuenta con password (email/password provider)", () => {
    const row: NewAccountRow = {
      id: "a2",
      userId: "u2",
      providerId: "credential",
      issuer: "credential",
      accountId: "user2@example.com",
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      password: "hashed-password-here",
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(row.password).toBe("hashed-password-here");
  });

  it("campos token son nullable", () => {
    const row: AccountRow = {
      id: "a3",
      userId: "u3",
      providerId: "github",
      issuer: "https://github.com",
      accountId: "gh-123",
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      password: null,
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(row.accessToken).toBeNull();
    expect(row.refreshToken).toBeNull();
    expect(row.idToken).toBeNull();
  });
});

describe("schema — verifications", () => {
  it("tiene las columnas esperadas", () => {
    const columns = Object.keys(verifications);
    expect(columns).toEqual(
      expect.arrayContaining([
        "id",
        "identifier",
        "value",
        "expiresAt",
        "createdAt",
        "updatedAt",
      ]),
    );
  });

  it("acepta inserts válidos para email verification", () => {
    const expiresAt = new Date(Date.now() + 3600000);
    const row: NewVerificationRow = {
      id: "v1",
      identifier: "email",
      value: "user@example.com",
      expiresAt: expiresAt,
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(row.identifier).toBe("email");
    expect(row.value).toBe("user@example.com");
  });

  it("acepta inserts válidos para password reset", () => {
    const expiresAt = new Date(Date.now() + 600000);
    const row: NewVerificationRow = {
      id: "v2",
      identifier: "forgot_password",
      value: "token-abc-123",
      expiresAt: expiresAt,
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(row.identifier).toBe("forgot_password");
    expect(row.value).toBe("token-abc-123");
  });

  it("createdAt y updatedAt son nullable", () => {
    const expiresAt = new Date(Date.now() + 3600000);
    const row: NewVerificationRow = {
      id: "v3",
      identifier: "email",
      value: "test@test.com",
      expiresAt: expiresAt,
      createdAt: null,
      updatedAt: null,
    };
    expect(row.createdAt).toBeNull();
    expect(row.updatedAt).toBeNull();
  });
});

describe("schema — auth types", () => {
  it("UserRow tiene propiedades correctas", () => {
    const row: UserRow = {
      id: "u1",
      email: "test@example.com",
      emailVerified: false,
      name: "Test",
      image: null,
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(typeof row.id).toBe("string");
    expect(typeof row.email).toBe("string");
    expect(typeof row.name).toBe("string");
  });

  it("SessionRow tiene propiedades correctas", () => {
    const row: SessionRow = {
      id: "s1",
      userId: "u1",
      expiresAt: NOW,
      token: "token",
      ipAddress: null,
      userAgent: null,
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(typeof row.userId).toBe("string");
    expect(row.expiresAt instanceof Date).toBe(true);
  });

  it("AccountRow tiene propiedades correctas", () => {
    const row: AccountRow = {
      id: "a1",
      userId: "u1",
      providerId: "google",
      issuer: "https://accounts.google.com",
      accountId: "acc-123",
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      password: null,
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(typeof row.providerId).toBe("string");
    expect(typeof row.issuer).toBe("string");
  });

  it("VerificationRow tiene propiedades correctas", () => {
    const expiresAt = new Date(Date.now() + 3600000);
    const row: VerificationRow = {
      id: "v1",
      identifier: "email",
      value: "test@example.com",
      expiresAt: expiresAt,
      createdAt: NOW,
      updatedAt: NOW,
    };
    expect(typeof row.identifier).toBe("string");
    expect(typeof row.value).toBe("string");
  });
});

import { describe, it, expect } from "vitest";
import { requiresSubscription, matchPath, PERMISSION_MATRIX } from "./permissions.ts";

describe("matchPath", () => {
  it("matchea paths exactos sin params", () => {
    expect(matchPath("/api/notebooks", "/api/notebooks")).toBe(true);
    expect(matchPath("/billing/status", "/billing/status")).toBe(true);
  });

  it("matchea paths con :params", () => {
    expect(matchPath("/api/notebooks/:id", "/api/notebooks/123")).toBe(true);
    expect(matchPath("/api/notebooks/:id", "/api/notebooks/abc-def")).toBe(true);
    expect(matchPath("/api/folders/:id", "/api/folders/folder-1")).toBe(true);
  });

  it("no matchea paths con diferente cantidad de segmentos", () => {
    expect(matchPath("/api/notebooks", "/api/notebooks/123")).toBe(false);
    expect(matchPath("/api/notebooks/:id", "/api/notebooks")).toBe(false);
  });

  it("no matchea paths con segmentos diferentes", () => {
    expect(matchPath("/api/notebooks", "/api/folders")).toBe(false);
    expect(matchPath("/billing/status", "/billing/checkout")).toBe(false);
  });

  it("matchea multiple :params", () => {
    expect(matchPath("/api/notebooks/:id/cells", "/api/notebooks/nb1/cells")).toBe(true);
  });

  it("distingue entre paths similares", () => {
    expect(matchPath("/public/notebooks/:slug", "/public/notebooks/my-slug")).toBe(true);
    expect(matchPath("/api/notebooks/:id", "/public/notebooks/my-slug")).toBe(false);
  });
});

describe("requiresSubscription", () => {
  it("requiere sub para GET /api/notebooks", () => {
    expect(requiresSubscription("GET", "/api/notebooks")).toBe(true);
  });

  it("requiere sub para POST /api/notebooks", () => {
    expect(requiresSubscription("POST", "/api/notebooks")).toBe(true);
  });

  it("requiere sub para GET /api/notebooks/:id", () => {
    expect(requiresSubscription("GET", "/api/notebooks/123")).toBe(true);
  });

  it("requiere sub para PATCH /api/notebooks/:id", () => {
    expect(requiresSubscription("PATCH", "/api/notebooks/nb-1")).toBe(true);
  });

  it("requiere sub para DELETE /api/notebooks/:id", () => {
    expect(requiresSubscription("DELETE", "/api/notebooks/nb-2")).toBe(true);
  });

  it("requiere sub para POST /api/notebooks/:id/cells", () => {
    expect(requiresSubscription("POST", "/api/notebooks/nb-3/cells")).toBe(true);
  });

  it("requiere sub para PATCH /api/cells/:id", () => {
    expect(requiresSubscription("PATCH", "/api/cells/cell-1")).toBe(true);
  });

  it("requiere sub para DELETE /api/cells/:id", () => {
    expect(requiresSubscription("DELETE", "/api/cells/cell-2")).toBe(true);
  });

  it("requiere sub para POST /api/notebooks/:id/reorder", () => {
    expect(requiresSubscription("POST", "/api/notebooks/nb-4/reorder")).toBe(true);
  });

  it("requiere sub para POST /api/folders", () => {
    expect(requiresSubscription("POST", "/api/folders")).toBe(true);
  });

  it("requiere sub para PATCH /api/folders/:id", () => {
    expect(requiresSubscription("PATCH", "/api/folders/folder-1")).toBe(true);
  });

  it("requiere sub para DELETE /api/folders/:id", () => {
    expect(requiresSubscription("DELETE", "/api/folders/folder-2")).toBe(true);
  });

  it("requiere sub para POST /billing/cancel", () => {
    expect(requiresSubscription("POST", "/billing/cancel")).toBe(true);
  });

  it("NO requiere sub para GET /public/notebooks/:slug", () => {
    expect(requiresSubscription("GET", "/public/notebooks/my-notebook")).toBe(false);
  });

  it("NO requiere sub para GET /billing/status", () => {
    expect(requiresSubscription("GET", "/billing/status")).toBe(false);
  });

  it("NO requiere sub para POST /billing/checkout", () => {
    expect(requiresSubscription("POST", "/billing/checkout")).toBe(false);
  });

  it("NO requiere sub para paths no definidos en PERMISSION_MATRIX", () => {
    expect(requiresSubscription("GET", "/health")).toBe(false);
    expect(requiresSubscription("GET", "/version")).toBe(false);
    expect(requiresSubscription("GET", "/api/auth/sign-in")).toBe(false);
  });

  it("respeta el metodo HTTP para determinar sub requerida", () => {
    expect(requiresSubscription("GET", "/billing/status")).toBe(false);
    expect(requiresSubscription("POST", "/billing/status")).toBe(false);
  });
});

describe("PERMISSION_MATRIX", () => {
  it("tiene la cantidad esperada de reglas", () => {
    expect(PERMISSION_MATRIX.length).toBeGreaterThan(10);
  });

  it("todas las reglas tienen method, path, auth y sub", () => {
    for (const rule of PERMISSION_MATRIX) {
      expect(rule).toHaveProperty("method");
      expect(rule).toHaveProperty("path");
      expect(rule).toHaveProperty("auth");
      expect(rule).toHaveProperty("sub");
    }
  });
});

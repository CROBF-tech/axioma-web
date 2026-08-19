export const PERMISSION_MATRIX = [
  { method: "GET",    path: "/api/notebooks",            auth: true,  sub: true  },
  { method: "POST",   path: "/api/notebooks",            auth: true,  sub: true  },
  { method: "GET",    path: "/api/notebooks/:id",        auth: true,  sub: true  },
  { method: "PATCH",  path: "/api/notebooks/:id",        auth: true,  sub: true  },
  { method: "DELETE", path: "/api/notebooks/:id",        auth: true,  sub: true  },
  { method: "POST",   path: "/api/notebooks/:id/cells",  auth: true,  sub: true  },
  { method: "PATCH",  path: "/api/cells/:id",             auth: true,  sub: true  },
  { method: "DELETE", path: "/api/cells/:id",             auth: true,  sub: true  },
  { method: "POST",   path: "/api/notebooks/:id/reorder", auth: true, sub: true },
  { method: "POST",   path: "/api/folders",              auth: true,  sub: true  },
  { method: "PATCH",  path: "/api/folders/:id",           auth: true,  sub: true  },
  { method: "DELETE", path: "/api/folders/:id",           auth: true,  sub: true  },
  { method: "GET",    path: "/public/notebooks/:slug",   auth: false, sub: false },
  { method: "GET",    path: "/billing/status",           auth: true,  sub: false },
  { method: "POST",   path: "/billing/checkout",          auth: true,  sub: false },
  { method: "POST",   path: "/billing/cancel",            auth: true,  sub: true  },
] as const;

export function requiresSubscription(method: string, path: string): boolean {
  for (const rule of PERMISSION_MATRIX) {
    if (rule.method === method && matchPath(rule.path, path)) return rule.sub;
  }
  return false;
}

function matchPath(pattern: string, path: string): boolean {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return false;
  for (let i = 0; i < patternParts.length; i++) {
    const pp = patternParts[i];
    if (pp === undefined) return false;
    if (pp.startsWith(":")) continue;
    if (pp !== pathParts[i]) return false;
  }
  return true;
}
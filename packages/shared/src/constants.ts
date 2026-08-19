export type ID = string;

export const CELL_KINDS = ["math", "text", "plot"] as const;
export const SUBSCRIPTION_PLANS = ["monthly", "annual"] as const;
export const SUBSCRIPTION_STATUSES = ["active", "pending", "cancelled", "expired"] as const;
export const SUBSCRIPTION_RESPONSE_STATUSES = ["active", "pending", "cancelled", "expired", "none"] as const;
export const MP_EVENT_TYPES = ["preapproval_authorized", "payment_failed", "cancelled"] as const;

export const PUBLIC_SLUG_MIN_LENGTH = 22;
export const PUBLIC_SLUG_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const PUBLIC_NOTEBOOK_ROUTE_TEMPLATE = "/s/:slug";

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const AUTH_RATE_LIMIT = { max: 10, windowMs: 60_000 } as const;

export const CACHE_STALE_MS_DEFAULT = 60_000;

export const ERROR_CODES = {
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  PAYMENT_REQUIRED: "PAYMENT_REQUIRED",
  VALIDATION: "VALIDATION",
  INTERNAL: "INTERNAL",
} as const;

export const ACCENT_PRESETS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4",
] as const;

export const DEFAULT_ACCENT = "#6366f1";

export const STORAGE_KEYS = {
  theme: "axioma.theme",
  accent: "axioma.accent",
} as const;

export const AUTH_ERROR_MESSAGE = "Credenciales inválidas";
export const SIGNUP_GENERIC_MESSAGE = "Si el email no está registrado, no podemos crear la cuenta. Intenta con otro email.";

export const PUBLIC_ROUTE_PATTERNS = [
  "/health",
  "/version",
  "/api/auth/*",
  "GET /public/notebooks/:slug",
] as const;

export const PLANS = {
  monthly: { amount: 2, currency: "USD", frequency: 1, frequencyType: "months" },
  annual: { amount: 18, currency: "USD", frequency: 12, frequencyType: "months" },
} as const;

export const PERMISSION_MATRIX = [
  { method: "GET",    path: "/api/notebooks",         auth: true,  sub: true  },
  { method: "POST",   path: "/api/notebooks",         auth: true,  sub: true  },
  { method: "GET",    path: "/api/notebooks/:id",     auth: true,  sub: true  },
  { method: "PATCH",  path: "/api/notebooks/:id",     auth: true,  sub: true  },
  { method: "DELETE", path: "/api/notebooks/:id",     auth: true,  sub: true  },
  { method: "POST",   path: "/api/notebooks/:id/cells", auth: true, sub: true },
  { method: "PATCH",  path: "/api/cells/:id",         auth: true,  sub: true  },
  { method: "DELETE", path: "/api/cells/:id",         auth: true,  sub: true  },
  { method: "POST",   path: "/api/notebooks/:id/reorder", auth: true, sub: true },
  { method: "POST",   path: "/api/folders",           auth: true,  sub: true  },
  { method: "PATCH",  path: "/api/folders/:id",       auth: true,  sub: true  },
  { method: "DELETE", path: "/api/folders/:id",       auth: true,  sub: true  },
  { method: "GET",    path: "/public/notebooks/:slug", auth: false, sub: false },
  { method: "GET",    path: "/billing/status",        auth: true,  sub: false },
  { method: "POST",   path: "/billing/checkout",       auth: true, sub: false },
  { method: "POST",   path: "/billing/cancel",         auth: true, sub: true  },
] as const;

export const NOTEBOOK_SHORTCUTS = [
  { key: "Enter",  ctrlOrCmd: true,  action: "run-cell",   label: "Ejecutar celda" },
  { key: "ArrowDown", ctrlOrCmd: false, action: "next-cell", label: "Celda siguiente" },
  { key: "ArrowUp",   ctrlOrCmd: false, action: "prev-cell", label: "Celda anterior" },
  { key: "Escape",  ctrlOrCmd: false, action: "blur-input", label: "Salir del input" },
] as const;
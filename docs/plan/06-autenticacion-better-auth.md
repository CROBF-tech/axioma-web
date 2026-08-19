# Paso 06 — Autenticación con better-auth

## Objetivo

Registro/login **email + password**, sesiones, middleware de auth en Hono. Sin login social.

## Skills usadas

- `better-auth-best-practices` (instalada, oficial).
- `email-and-password-best-practices` (instalada, oficial).
- Docs Context7 `/better-auth/better-auth`.

## Configuración servidor (`apps/api/src/auth/`)

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // arrancamos sin verificación (MVP); activar luego
    minPasswordLength: 8,
    autoSignIn: true,
  },
});
```

Mount en Hono (Better Auth usa Web Standards; no requiere adapter de Hono):
```ts
app.all("/api/auth/*", (c) => auth.handler(c.req.raw));
```

> Tipar `c.get('user')` con `Hono<{ Variables: { user: typeof auth.$Infer.Session.user | null } }>`.

## Cliente web (`apps/web/src/auth/`)
```ts
import { createAuthClient } from "better-auth/client";
export const authClient = createAuthClient({ baseURL: import.meta.env.VITE_API_URL });
```
Hooks: `useSession()`, `signIn.email()`, `signUp.email()`, `signOut()`.

## Middleware de auth
`apps/api/src/middleware/auth.ts`:
- Lee sesión de la request (vía `auth.api.getSession`).
- Inyecta `ctx.user` o rechaza con 401 en rutas protegidas.
- Rutas públicas: `/health`, `/api/auth/*`, `GET /public/notebooks/:slug`.

## Validación de email
MVP: **sin** verificación por email (spec no la exige). Queda como toggle futuro (`requireEmailVerification`). Documentar en `auth/README`.

## Reset password
Configurado `sendResetPassword` con stub de email (consola en dev). En prod: integrar proveedor (Resend o similar — fuera de scope MVP, pero dejar hook).

## Seguridad
- `BETTER_AUTH_SECRET` obligatorio.
- Cookies `httpOnly`, `secure` en prod, `sameSite=lax`.
- Rate limit en `/sign-in` y `/sign-up` (`@hono/rate-limiter`).

## Entregables

- `auth/server.ts`, `auth/client.ts`.
- Middleware `requireAuth`.
- Rutas: `/sign-up`, `/sign-in`, `/sign-out`, `/session` (todas vía better-auth).
- Página `/login` y `/register` mínimas en el frontend.

## Criterios de aceptación

- [ ] Registro crea `user` en Turso.
- [ ] Login devuelve sesión; cookie httpOnly seteada.
- [ ] Ruta protegida sin sesión → 401.
- [ ] Logout invalida sesión.
- [ ] Rate limit activo en auth.
- [ ] No hay fuga de mensajes de error que revelen existencia de email (usar `onExistingUserSignUp` o mensaje genérico).
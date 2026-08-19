# Task 06-T04 — Middleware `requireAuth` en backend

- **Paso:** 06 — Autenticación better-auth
- **Tiempo estimado:** 1 hora
- **Depende de:** 06-T02

## Contexto

Plan paso 06 líneas 44-48.

## Alcance

- `apps/api/src/middleware/auth.ts`:
  ```ts
  import { createMiddleware } from 'hono/factory';
  import { auth } from '../auth/server';

  export const requireAuth = createMiddleware(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);
    c.set('user', session.user);
    await next();
  });
  ```
- Variable tipada: `c.get('user')` es `User`.

## Entregable

- Middleware + ruta protegida de prueba.

## Criterios de aceptación

- [ ] `GET /api/me` sin cookie → 401.
- [ ] `GET /api/me` con cookie → 200 con datos del user.
- [ ] Rutas públicas: `/health`, `/version`, `/api/auth/*`, `GET /public/notebooks/:slug` (placeholder, ver paso 12).
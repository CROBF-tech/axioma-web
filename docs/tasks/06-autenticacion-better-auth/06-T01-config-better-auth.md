# Task 06-T01 — Instalar y configurar `better-auth` con adapter Drizzle

- **Paso:** 06 — Autenticación better-auth
- **Tiempo estimado:** 2 horas
- **Depende de:** 05-T01

## Contexto

Plan paso 06 líneas 14-28. Spec: solo email+password.

## Alcance

- Deps en `apps/api`: `better-auth`.
- Crear `apps/api/src/auth/server.ts`:
  ```ts
  import { betterAuth } from 'better-auth';
  import { drizzleAdapter } from '@better-auth/drizzle-adapter';
  import { db } from '../db/client';

  export const auth = betterAuth({
    database: drizzleAdapter(db, { provider: 'sqlite' }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    cookies: {
      session: { attributes: { sameSite: 'lax', secure: env.NODE_ENV === 'production' } },
    },
  });
  ```
- Generar tablas con `npx @better-auth/cli generate` o según docs.

## Entregable

- `auth/server.ts` con `auth` exportado.
- Tablas de better-auth (`user`, `session`, `account`, `verification`) en schema.

## Criterios de aceptación

- [ ] Instancia `betterAuth` se construye sin error.
- [ ] Drizzle adapter detecta las tablas existentes.
- [ ] `BETTER_AUTH_SECRET` se lee desde env validado.
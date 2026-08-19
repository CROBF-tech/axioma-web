# Task 04-T02 — Validación de env con Zod

- **Paso:** 04 — Backend Hono base
- **Tiempo estimado:** 1 hora
- **Depende de:** 04-T01

## Contexto

Plan paso 04 línea 17, 45.

## Alcance

- `apps/api/src/env.ts`:
  ```ts
  import { z } from 'zod';
  const schema = z.object({
    PORT: z.coerce.number().default(3001),
    DATABASE_URL: z.string(),
    DATABASE_AUTH_TOKEN: z.string().optional(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
    MP_ACCESS_TOKEN: z.string(),
    MP_WEBHOOK_SECRET: z.string(),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
  });
  export const env = schema.parse(process.env);
  ```
- Si falla, log explícito y exit code 1.

## Entregable

- `env.ts` validando al arrancar.

## Criterios de aceptación

- [ ] Faltar `BETTER_AUTH_SECRET` → crash con mensaje claro, no stacktrace críptico.
- [ ] `PORT=abc` se coerce a `NaN` → falla con error útil.
- [ ] Pasar todas las vars arranca normal.
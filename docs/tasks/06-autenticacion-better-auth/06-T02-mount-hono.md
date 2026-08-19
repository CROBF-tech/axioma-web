# Task 06-T02 — Mount handler en Hono (`/api/auth/*`)

- **Paso:** 06 — Autenticación better-auth
- **Tiempo estimado:** 30 min
- **Depende de:** 06-T01, 04-T05

## Contexto

Plan paso 06 líneas 30-34.

## Alcance

- En `apps/api/src/index.ts`:
  ```ts
  app.all('/api/auth/*', (c) => auth.handler(c.req.raw));
  ```
- Verificar que `POST /api/auth/sign-up/email` está disponible.

## Entregable

- Handler registrado.

## Criterios de aceptación

- [ ] `curl -X POST -H 'content-type: application/json' -d '{"email":"a@b.c","password":"longpassword"}' :3001/api/auth/sign-up/email` devuelve 200 con user.
- [ ] Cookies se setean con `httpOnly`.
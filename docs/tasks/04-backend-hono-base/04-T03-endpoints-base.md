# Task 04-T03 — Endpoints `/health` y `/version`

- **Paso:** 04 — Backend Hono base
- **Tiempo estimado:** 30 min
- **Depende de:** 04-T02

## Contexto

Plan paso 04 líneas 38-40.

## Alcance

- `routes/health.ts`:
  ```ts
  app.get('/health', (c) => c.json({ status: 'ok', ts: Date.now() }));
  ```
- `routes/version.ts`:
  ```ts
  app.get('/version', (c) => c.json({ version: pkg.version }));
  ```
- `pkg` se importa de `../../package.json`.

## Entregable

- Dos rutas registradas.

## Criterios de aceptación

- [ ] `GET /health` 200.
- [ ] `GET /version` retorna `1.0.0` (o la versión actual).
- [ ] Ningún endpoint requiere auth.
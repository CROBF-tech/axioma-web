# Task 04-T04 — Middleware de errores + 404 JSON

- **Paso:** 04 — Backend Hono base
- **Tiempo estimado:** 1 hora
- **Depende de:** 04-T03

## Contexto

Plan paso 04 líneas 47, 52-54.

## Alcance

- `middleware/error.ts` global: catch any, log structured, return JSON `{ error, code }`.
- En dev, añadir stack; en prod, omitirlo.
- `app.notFound(c => c.json({ error: 'NotFound', code: 'NOT_FOUND' }, 404))`.

## Entregable

- Middleware registrado en `index.ts`.

## Criterios de aceptación

- [ ] GET a `/does-not-exist` responde 404 JSON.
- [ ] Lanzar un error en una ruta devuelve 500 JSON.
- [ ] En `NODE_ENV=production`, el body no contiene stack.
- [ ] Logs estructurados (incluye requestId).
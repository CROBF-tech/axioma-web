# Task 04-T01 — Configurar servidor Hono + Node adapter + listen

- **Paso:** 04 — Backend Hono base
- **Tiempo estimado:** 30 min
- **Depende de:** 02-T05

## Contexto

Plan paso 04 líneas 30-34.

## Alcance

- `apps/api/src/index.ts`:
  ```ts
  import { Hono } from 'hono';
  import { serve } from '@hono/node-server';
  const app = new Hono();
  app.get('/health', (c) => c.json({ status: 'ok', ts: Date.now() }));
  serve({ fetch: app.fetch, port: Number(env.PORT) });
  ```
- Verificar arranque en `:3001`.

## Entregable

- `index.ts` funcional.

## Criterios de aceptación

- [ ] `bun --filter @axioma/api dev` levanta.
- [ ] `curl :3001/health` responde 200.
- [ ] Graceful shutdown (Ctrl+C cierra limpio).
# Task 02-T05 — Scaffold `apps/api` con Hono + TS

- **Paso:** 02 — Estructura del monorepo
- **Tiempo estimado:** 1 hora
- **Depende de:** 02-T01, 02-T02

## Contexto

Plan paso 02 línea 47: Hono en backend. Runtime a confirmar (Node vs Bun). Recomendado Node por mejor soporte de Mercado Pago SDK.

## Alcance

- Crear `apps/api/package.json` con name `@axioma/api`.
- Deps: `hono`, `@hono/node-server`, `tsx` (dev), `zod`.
- Scripts:
  - `dev`: `tsx watch src/index.ts`
  - `start`: `node --import tsx/esm src/index.ts`
- Crear `src/index.ts` con `app.get('/health', c => c.json({ ok: true }))` y `serve(app)`.
- Alias `@api/*` configurado.

## Entregable

- `apps/api` con endpoint `/health` funcional.

## Criterios de aceptación

- [ ] `bun --filter @axioma/api dev` levanta en `:3001`.
- [ ] `curl http://localhost:3001/health` responde `{"ok":true}`.
- [ ] Typecheck pasa.
- [ ] Watch mode detecta cambios en `src/`.
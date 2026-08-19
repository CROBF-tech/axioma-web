# Paso 04 — Backend Hono base

## Objetivo

Levantar el servidor Hono desde cero, con estructura de rutas, manejo de env, logging y health.

## Skill usada

- `hono` (instalada, oficial `yusukebe/skills@hono`).
- `nodejs-backend-patterns` (instalada) — middleware, errores, estructura.

## Estructura

```
apps/api/src/
├── index.ts          # app Hono + serve
├── env.ts            # validación de env (zod)
├── routes/
│   ├── health.ts
│   ├── notebooks.ts  # (stub)
│   └── billing.ts    # (stub)
├── middleware/
│   ├── error.ts      # errorHandler
│   ├── logger.ts
│   └── auth.ts       # (paso 06)
└── services/         # casos de uso
```

## Decisiones

- **Runtime:** Node 20+ vía `@hono/node-server` (o Bun — evaluar). Recomendado Node para compatibilidad better-auth/Mercado Pago SDK.
- **CORS:** `@hono/cors` con origin = `VITE_API_URL`.
- **Validación:** `zod` + `@hono/zod-openapi` (opcional para OpenAPI futuro).
- **Logger:** `hono/logger` + structured logging en prod (`pino` si hace falta).
- **Errores:** middleware que siempre devuelve JSON `{ error, code }`, nunca stack.

## Endpoints mínimos

- `GET /health` → `{ status: "ok", ts }`.
- `GET /version` → versión desde `package.json`.

## Entregables

- `apps/api` funcional con `/health`.
- `env.ts` con schema zod y fallo claro si falta variable.
- Middleware de errores cubriendo rutas no encontradas y excepciones.

## Criterios de aceptación

- [ ] `bun --filter @axioma/api dev` levanta en `:3001`.
- [ ] `GET /health` responde 200.
- [ ] Ruta inexistente responde 404 JSON, no HTML.
- [ ] Excepción no manejada responde 500 JSON sin filtrar stack en prod.
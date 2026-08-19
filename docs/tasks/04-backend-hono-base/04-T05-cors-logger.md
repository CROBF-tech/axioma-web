# Task 04-T05 — CORS y logger request/response

- **Paso:** 04 — Backend Hono base
- **Tiempo estimado:** 1 hora
- **Depende de:** 04-T04

## Contexto

Plan paso 04 líneas 32-34.

## Alcance

- `@hono/cors`: `origin: env.NODE_ENV === 'production' ? [WEB_URL] : '*'`, `credentials: true`.
- `hono/logger` middleware global.
- En prod, sustituir por `pino` con formato JSON.

## Entregable

- Middlewares registrados antes de las rutas.

## Criterios de aceptación

- [ ] Petición desde `localhost:5173` a `:3001/health` recibe `Access-Control-Allow-*`.
- [ ] Logger imprime método + ruta + status + duración.
- [ ] `credentials: true` permite cookies.
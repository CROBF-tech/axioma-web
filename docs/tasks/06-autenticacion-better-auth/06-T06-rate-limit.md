# Task 06-T06 — Rate limit en sign-in/sign-up

- **Paso:** 06 — Autenticación better-auth
- **Tiempo estimado:** 1 hora
- **Depende de:** 06-T02

## Contexto

Plan paso 06 línea 58.

## Alcance

- Instalar `@hono/rate-limiter`.
- Wrap manual de rutas `/api/auth/sign-in/email` y `/api/auth/sign-up/email` con:
  - 10 req/min por IP.
  - Respuesta 429 con `Retry-After` header.

## Entregable

- Middleware aplicado a las dos rutas.

## Criterios de aceptación

- [ ] 11 requests en 1 min → la #11 responde 429.
- [ ] Después de 1 min, vuelve a aceptar.
- [ ] Login legítimo no se ve afectado por tráfico en otra IP.
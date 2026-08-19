# Task 11-T07 — Middleware `requireSubscription` y matriz de permisos

- **Paso:** 11 — Suscripción Mercado Pago
- **Tiempo estimado:** 2 horas
- **Depende de:** 11-T05

## Contexto

Inconsistencia D7 del plan. Documentar matriz de permisos.

## Alcance

- `apps/api/src/middleware/requireSub.ts`:
  - Lee status del user desde `subscriptions`.
  - Si no está `active`, return 402 Payment Required.
- Aplicar a `POST/PATCH/DELETE /api/notebooks/**`, no a `GET /public/notebooks/:slug` ni a `/health`.
- Documentar matriz:
  ```
  Endpoint                        | Auth | Sub | Notas
  -------------------------------|------|-----|------
  GET /api/notebooks             | sí   | sí  |
  POST /api/notebooks            | sí   | sí  |
  GET /public/notebooks/:slug    | no   | no  | implementación en paso 12
  GET /health                    | no   | no  |
  ```

## Entregable

- Middleware + tabla documentada.

## Criterios de aceptación

- [ ] Sin sub activa, `POST /api/notebooks` → 402.
- [ ] Con sub activa, mismo POST → 200.
- [ ] Tabla mantenida en `docs/permissions.md`.
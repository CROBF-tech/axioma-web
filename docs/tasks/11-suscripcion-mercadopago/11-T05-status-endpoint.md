# Task 11-T05 — Endpoint `GET /billing/status`

- **Paso:** 11 — Suscripción Mercado Pago
- **Tiempo estimado:** 30 min
- **Depende de:** 11-T04

## Contexto

Plan paso 11 línea 35.

## Alcance

- `routes/billing.ts`: lee `subscriptions` del usuario actual y devuelve:
  ```ts
  { status, plan, current_period_end }
  ```

## Entregable

- Endpoint.

## Criterios de aceptación

- [ ] Usuario sin suscripción → 200 con `{ status: 'none' }`.
- [ ] Usuario con `active` → 200 con datos.
- [ ] Devuelve `current_period_end` como ISO string.
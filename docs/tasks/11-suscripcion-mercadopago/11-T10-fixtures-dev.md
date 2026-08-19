# Task 11-T10 — Fixtures de dev para simular webhook

- **Paso:** 11 — Suscripción Mercado Pago
- **Tiempo estimado:** 2 horas
- **Depende de:** 11-T04

## Contexto

Plan paso 11 línea 54.

## Alcance

- Script `scripts/simulate-webhook.ts` que dispara cada evento (`preapproval_authorized`, `payment_failed`, `cancelled`) contra `localhost:3001`.
- Firma falsa o bypass usando `x-dev-bypass: 1` (solo si `NODE_ENV !== 'production'`).

## Entregable

- Script + flag.

## Criterios de aceptación

- [ ] `bun simulate-webhook authorized` activa una sub de prueba.
- [ ] Bypass desactivado en prod (ignora header).
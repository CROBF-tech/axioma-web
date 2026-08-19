# Task 11-T06 — Endpoint `POST /billing/cancel`

- **Paso:** 11 — Suscripción Mercado Pago
- **Tiempo estimado:** 1 hora
- **Depende de:** 11-T05

## Contexto

Plan paso 11 línea 36.

## Alcance

- Llama `preapproval.update({ id, status: 'cancelled' })`.
- Localmente: `subscriptions.status = 'cancelled'`.
- Mantiene `current_period_end` para accesos hasta fin de periodo.

## Entregable

- Cancelación end-to-end.

## Criterios de aceptación

- [ ] Cancelar actualiza MP y DB.
- [ ] Acceso continúa hasta `current_period_end`.
- [ ] Tras esa fecha, `status='expired'` (cron o check on read).
# Task 11-T02 — Definir planes (`monthly`, `annual`) con precios

- **Paso:** 11 — Suscripción Mercado Pago
- **Tiempo estimado:** 30 min
- **Depende de:** 11-T01

## Contexto

Spec línea 16: `~u$s2/mes de referencia`. Anual con descuento.

## Alcance

- `apps/api/src/services/plans.ts`:
  ```ts
  export const PLANS = {
    monthly: { amount: 2, currency: 'USD', frequency: 1, frequency_type: 'months', freeTrial: undefined },
    annual:  { amount: 18, currency: 'USD', frequency: 12, frequency_type: 'months' },
  } as const;
  ```
- Confirmar valores finales con CROBF.

## Entregable

- Config central.

## Criterios de aceptación

- [ ] Precios inyectables por env si cambia.
- [ ] Tipos estrictos para `plan`.
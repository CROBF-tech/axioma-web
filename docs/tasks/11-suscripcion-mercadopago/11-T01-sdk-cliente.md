# Task 11-T01 — Instalar SDK Mercado Pago y configurar cliente

- **Paso:** 11 — Suscripción Mercado Pago
- **Tiempo estimado:** 2 horas
- **Depende de:** 04-T02

## Contexto

Plan paso 11 líneas 9-19.

## Alcance

- Deps: `mercadopago` (oficial).
- `apps/api/src/services/mercadopago.ts`:
  ```ts
  import { MercadoPagoConfig, PreApproval } from 'mercadopago';
  const client = new MercadoPagoConfig({ accessToken: env.MP_ACCESS_TOKEN });
  export const preapproval = new PreApproval(client);
  ```

## Entregable

- Cliente configurado.

## Criterios de aceptación

- [ ] `preapproval.create({...})` realiza una request a MP en sandbox.
- [ ] Token inválido lanza error legible.
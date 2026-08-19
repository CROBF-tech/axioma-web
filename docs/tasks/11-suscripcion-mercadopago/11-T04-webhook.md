# Task 11-T04 — Webhook `POST /webhooks/mp` con verificación de firma

- **Paso:** 11 — Suscripción Mercado Pago
- **Tiempo estimado:** 3 horas
- **Depende de:** 11-T03

## Contexto

Plan paso 11 líneas 25-27.

## Alcance

- `routes/billing.ts`:
  ```ts
  app.post('/webhooks/mp', async (c) => {
    const sig = c.req.header('x-signature');
    if (!verifyMpSignature(sig, body, env.MP_WEBHOOK_SECRET)) return c.json({ error: 'Invalid signature' }, 401);
    const event = await c.req.json();
    // event.type: 'preapproval_authorized' | 'payment_failed' | etc.
    await handleMpEvent(event);
    return c.text('', 200);
  });
  ```
- Actualizar `subscriptions.status` y `current_period_end` según event.

## Entregable

- Handler idempotente.

## Criterios de aceptación

- [ ] Firma inválida → 401.
- [ ] `preapproval_authorized` → `status='active'`.
- [ ] `payment_failed` o `cancelled` → `status='expired'|'cancelled'`.
- [ ] Re-recibir mismo evento no duplica.
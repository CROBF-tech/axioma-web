# Task 11-T03 — Endpoint `POST /billing/checkout`

- **Paso:** 11 — Suscripción Mercado Pago
- **Tiempo estimado:** 2 horas
- **Depende de:** 11-T01, 11-T02, 06-T04

## Contexto

Plan paso 11 líneas 23, 33.

## Alcance

- `routes/billing.ts`:
  ```ts
  app.post('/billing/checkout', requireAuth, async (c) => {
    const { plan } = await c.req.json();
    const cfg = PLANS[plan];
    const r = await preapproval.create({ body: {
      reason: 'Axioma',
      auto_recurring: { ...cfg, transaction_amount: cfg.amount, currency_id: cfg.currency },
      back_url: `${env.WEB_URL}/billing/return`,
      payer_email: c.get('user').email,
    }});
    // Insertar subscriptions con status='pending'
    await db.insert(subscriptions).values({ id, userId, plan, status: 'pending', mpPreapprovalId: r.id });
    return c.json({ init_point: r.init_point });
  });
  ```

## Entregable

- Endpoint funcional en sandbox.

## Criterios de aceptación

- [ ] `POST { plan: 'monthly' }` devuelve `init_point` válido.
- [ ] Usuario ya con `active` no puede crear otra suscripción (error 409).
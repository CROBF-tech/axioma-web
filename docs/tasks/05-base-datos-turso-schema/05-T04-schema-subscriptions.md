# Task 05-T04 — Definir schema `subscriptions`

- **Paso:** 05 — Base de datos Turso + schema
- **Tiempo estimado:** 1 hora
- **Depende de:** 05-T02

## Contexto

Plan paso 05 líneas 65-75.

## Alcance

```ts
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  plan: text('plan', { enum: ['monthly','annual'] }).notNull(),
  status: text('status', { enum: ['active','pending','cancelled','expired'] }).notNull(),
  mpPreapprovalId: text('mp_preapproval_id'),
  currentPeriodEnd: integer('current_period_end', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
```
- Índice en `subscriptions.status` para queries de gating.

## Entregable

- Tabla + índice.

## Criterios de aceptación

- [ ] Tabla aplicada con `db:push`.
- [ ] `userId` único (1 sub activa por usuario).
- [ ] Tipo inferido exportado.
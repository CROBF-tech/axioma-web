# Paso 11 — Suscripción con Mercado Pago

## Objetivo

Cobro de suscripción: plan mensual y anual con descuento. Sin trial. Acceso completo requiere suscripción activa.

## Skills usadas

- `mercado-pago` (instalada, `membranedev/application-skills@mercado-pago`).

## Modelo

- **Sin trial.** Usuario se registra → *no* puede usar la app hasta pagar.
- **Planes:**
  - `monthly`: precio referencia u$s2/mes.
  - `annual`: 12 meses con descuento (ej. u$s18/año = 25% off). Valor final a confirmar.
- **Mercado Pago Preapproval API** (suscripción recurrente) — equivalente a subscription.
  - `POST /preapproval` para crear suscripción recurrente.
  - Webhook `preapproval` actualiza estado en `subscriptions`.

## Flujo

1. Usuario nuevo → tras registro, vista `/pricing` con los dos planes.
2. Selección → backend crea `preapproval` en MP → redirect a MP checkout.
3. MP webhook `POST /webhooks/mp` (firmado con `MP_WEBHOOK_SECRET`):
   - `preapproval_authorized` → `subscriptions.status = 'active'`, `current_period_end`.
   - `payment_failed` / `cancelled` → `status = 'expired' | 'cancelled'`.
4. Middleware `requireSubscription` en rutas de notebooks (excepto lectura pública).
5. Frontend: `useSession()` + `useSubscription()` → si inactiva, redirige a `/pricing`.

## Endpoints backend

- `POST /billing/checkout` `{ plan }` → devuelve `init_point` de MP.
- `POST /webhooks/mp` → recibir notificaciones.
- `GET /billing/status` → estado actual de suscripción del usuario.
- `POST /billing/cancel` → cancelar preapproval.

## Gating
- Middleware backend: bloquea `POST/PATCH/DELETE /notebooks/*` si `subscription.status !== 'active'`.
- Frontend: si no activa, solo puede ver `/pricing`, `/account`, logout. Notas públicas sí accesibles.

## Entregables

- `apps/api/src/routes/billing.ts`.
- `apps/api/src/services/mercadopago.ts` (cliente MP SDK).
- Webhook handler con verificación de firma.
- Página `/pricing` con dos planes.
- Middleware `requireSubscription`.

## Criterios de aceptación

- [ ] Usuario nuevo sin suscripción no puede crear notebooks.
- [ ] Checkout mensual y anual generan `init_point` válido.
- [ ] Webhook actualiza `subscriptions.status` correctamente (simulado en dev con fixtures).
- [ ] Cancelación pone `status=cancelled` y revoca acceso.
- [ ] Firma del webhook verificada; rechazada si inválida.
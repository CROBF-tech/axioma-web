# Task 11-T08 — Página `/pricing` con dos planes

- **Paso:** 11 — Suscripción Mercado Pago
- **Tiempo estimado:** 2 horas
- **Depende de:** 11-T03

## Contexto

Plan paso 11 línea 47.

## Alcance

- Página `/pricing` con dos cards:
  - `Mensual — u$s2/mes`.
  - `Anual — u$s18/año` (badge "Ahorrá 25%").
- Botón "Suscribirme" → `POST /billing/checkout` → window.location al `init_point`.

## Entregable

- `apps/web/src/features/billing/PricingPage.tsx`.

## Criterios de aceptación

- [ ] Cards usan tokens (sin colores hardcoded).
- [ ] Click redirige a MP sandbox.
- [ ] Botón deshabilitado si ya hay sub activa.
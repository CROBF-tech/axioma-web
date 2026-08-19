# Task 11-T09 — Hook `useSubscription()` y gating en frontend

- **Paso:** 11 — Suscripción Mercado Pago
- **Tiempo estimado:** 2 horas
- **Depende de:** 11-T05

## Contexto

Plan paso 11 línea 29.

## Alcance

- Hook `useSubscription()` que llama `GET /billing/status` cada vez que cambia sesión.
- HOC `<RequireActiveSub>{children}</RequireActiveSub>` que redirige a `/pricing` si no hay sub.
- Layout: si usuario autenticado sin sub, solo renderiza `/pricing`, `/account`, logout.

## Entregable

- Hook + componente.

## Criterios de aceptación

- [ ] User nuevo sin sub, intenta ir a `/library` → redirige a `/pricing`.
- [ ] Con sub activa, navegación completa.
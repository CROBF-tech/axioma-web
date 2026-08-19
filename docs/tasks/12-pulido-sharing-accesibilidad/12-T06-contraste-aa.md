# Task 12-T06 — Contraste AA verificado con axe/Lighthouse

- **Paso:** 12 — Pulido, sharing, a11y
- **Tiempo estimado:** 2 horas
- **Depende de:** 03-T05

## Contexto

Spec: "alternativa liviana y **accesible**".

## Alcance

- Correr axe-core en todas las rutas principales con playwright.
- Capturar violaciones y resolverlas.
- Lighthouse a11y ≥90.

## Entregable

- Suite CI que falla si baja de AA.

## Criterios de aceptación

- [ ] Cero violaciones críticas en las rutas: `/`, `/library`, `/notebooks/:id`, `/pricing`, `/s/:slug`, `/login`.
- [ ] Lighthouse score a11y ≥90.
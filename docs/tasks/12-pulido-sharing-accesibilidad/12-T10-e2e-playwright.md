# Task 12-T10 — Suite E2E Playwright (registro → uso → compartir)

- **Paso:** 12 — Pulido, sharing, a11y
- **Tiempo estimado:** 5 horas
- **Depende de:** 12-T05, 11-T10

## Contexto

Plan paso 12 líneas 30-32.

## Alcance

- Tests Playwright:
  - Registro (mock MP) → pricing → activar sub con fixture → crear notebook → ejecutar celda → compartir → abrir `/s/:slug` en otro contexto.
- Correr en CI.

## Entregable

- `apps/web/e2e/*.spec.ts`.

## Criterios de aceptación

- [ ] Suite pasa en CI.
- [ ] Cubre happy path completo.
- [ ] Mockea MP y email.
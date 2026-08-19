# Task 12-T11 — Lighthouse ≥90 perf + a11y

- **Paso:** 12 — Pulido, sharing, a11y
- **Tiempo estimado:** 3 horas
- **Depende de:** 12-T10

## Contexto

Plan paso 12 línea 32.

## Alcance

- Correr Lighthouse contra `/`, `/library`, `/notebooks/:id`, `/pricing`.
- Optimizar:
  - Lazy load nerdamer y function-plot.
  - Reducir JS inicial.
  - Preconnect fonts si las hay.
- Reporte en CI.

## Entregable

- Script + umbral ≥90 en ambas categorías.

## Criterios de aceptación

- [ ] Perf y a11y ≥90 en las 4 rutas.
- [ ] CI falla si baja.
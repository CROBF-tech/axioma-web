# Task 03-T05 — Página `/design` con muestras y verificación AA

- **Paso:** 03 — Diseño e identidad visual
- **Tiempo estimado:** 1 hora
- **Depende de:** 03-T04

## Contexto

Plan paso 03 línea 57.

## Alcance

- Crear ruta `/design` con muestras de:
  - Botones (primary, secondary, ghost).
  - Card con título y descripción.
  - Input con label.
  - Fórmula renderizada con KaTeX (`E = mc^2`).
- Toggle theme + AccentPicker visibles.
- Correr Lighthouse/accessibility y guardar reporte.

## Entregable

- `apps/web/src/features/design/DesignPage.tsx`.
- Reporte `tools/a11y-design.json` con score.

## Criterios de aceptación

- [ ] Lighthouse a11y ≥95 en `/design`.
- [ ] axe-core reporta 0 violaciones críticas.
- [ ] Contraste WCAG AA verificado entre `--fg` y `--bg` en ambos modos.
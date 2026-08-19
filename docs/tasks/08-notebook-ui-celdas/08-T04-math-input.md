# Task 08-T04 — Wrapper de `mathlive` (`MathInput`)

- **Paso:** 08 — Notebook UI celdas
- **Tiempo estimado:** 3 horas
- **Depende de:** 08-T03

## Contexto

Plan paso 08 líneas 53-58. Deps: `mathlive`.

## Alcance

- `<MathInput value latex onChange />`:
  ```tsx
  import 'mathlive';
  // En setup, configurar virtual keyboard layout.
  <math-field onInput={(e) => onChange(e.target.value)}>{value}</math-field>
  ```
- Hook `useMathField` para manejo de foco, teclado y eventos.
- Soportar dark mode (CSS de mathlive).

## Entregable

- `apps/web/src/features/notebook/MathInput.tsx`.

## Criterios de aceptación

- [ ] Escribir `\frac{1}{x}` en el campo actualiza `value` con LaTeX.
- [ ] Teclado virtual accesible (botón oculto, abre en `:focus`).
- [ ] Mantiene foco al cambiar `value` externamente (no aplicado).
- [ ] Cambiar theme reacciona.
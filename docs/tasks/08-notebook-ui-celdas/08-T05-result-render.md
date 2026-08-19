# Task 08-T05 — Render del resultado con KaTeX + pasos colapsables

- **Paso:** 08 — Notebook UI celdas
- **Tiempo estimado:** 2 horas
- **Depende de:** 08-T04

## Contexto

Plan paso 08 líneas 65-67. Deps: `katex`.

## Alcance

- `<Result result={EngineResult} />`:
  - Render principal con `<BlockMath math={result.latex} />`.
  - Si `partial === true`: badge "Resuelto parcialmente" + mostrar `steps[-1].latex` + texto "No pude resolver por completo; llegué hasta: ...".
  - Botón collapsible "Ver pasos" → `<details>` con lista de pasos.

## Entregable

- `apps/web/src/features/notebook/Result.tsx`.

## Criterios de aceptación

- [ ] Resultado correcto se ve renderizado y legible.
- [ ] Expandir "Ver pasos" muestra cada paso en KaTeX.
- [ ] Resultado parcial muestra la última expresión y badge.
- [ ] Sin error genérico visible en ningún caso.
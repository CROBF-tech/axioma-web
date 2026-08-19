# Task 08-T07 — Resolución de refs `$$cellId`

- **Paso:** 08 — Notebook UI celdas
- **Tiempo estimado:** 3 horas
- **Depende de:** 08-T05

## Contexto

Plan paso 08 líneas 60-63. Spec: "Referencia a resultados de celdas anteriores".

## Alcance

- Parser del input: detectar `$$cellId`.
- En `runCell`, sustituir refs por el `mathJson` (o LaTeX) de la celda referenciada.
- Auto-completar: `$$` abre popover con celdas anteriores seleccionables.
- Si la celda referenciada no existe o no tiene output, error contextual.

## Entregable

- Resolver + UI autocomplete.

## Criterios de aceptación

- [ ] Celda A define `x = 5`; Celda B usa `$$A` y produce 10 (= 2x).
- [ ] Autocompletar ofrece solo celdas anteriores.
- [ ] Referencia inválida muestra mensaje claro, no error genérico.
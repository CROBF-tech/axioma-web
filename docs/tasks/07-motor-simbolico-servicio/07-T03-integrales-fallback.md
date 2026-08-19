# Task 07-T03 — Soporte para integrales con fallback nerdamer

- **Paso:** 07 — Servicio motor simbólico
- **Tiempo estimado:** 3 horas
- **Depende de:** 07-T02

## Contexto

Plan paso 07 líneas 52-54. Depende de la decisión del paso 01.

## Alcance

- `integral(latex, variable)`:
  1. Intentar `ce.box(['Integrate', expr, variable])` → `expr.evaluate()`.
  2. Si falla o `partial`, importar lazy `nerdamer` y `nerdamer.integrate(latinExpr, var)`.
  3. Si ninguno resuelve, devolver `partial: true`.
- Marcar `engine: 'cortex' | 'nerdamer'`.

## Entregable

- Función + lazy import para nerdamer.

## Criterios de aceptación

- [ ] Integrales del paso 01 resueltas (directas o vía fallback).
- [ ] `engine: 'nerdamer'` cuando el crédito va a nerdamer.
- [ ] `partial: true` solo cuando **ninguno** resuelve.
- [ ] nerdamer **no** se importa si el cortex resuelve.
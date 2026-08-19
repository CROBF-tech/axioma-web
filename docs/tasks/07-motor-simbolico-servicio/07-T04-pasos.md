# Task 07-T04 — Extracción de pasos (`steps.ts`)

- **Paso:** 07 — Servicio motor simbólico
- **Tiempo estimado:** 2 horas
- **Depende de:** 07-T02

## Contexto

Spec línea 42: "nunca un error genérico sin contexto". Hay que capturar paso a paso.

## Alcance

- `packages/shared/src/engine/steps.ts`:
  ```ts
  export function extractSteps(expr: Expr): Step[];
  ```
- Recorrer `expr.ops` o similar árbol del `ComputeEngine` y mapear a `{ label, latex, rule? }`.
- Si no hay árbol accesible, derivar pasos por aplicación sucesiva de reglas (`Simplify`, `Expand`, etc.) y capturar diff intermedio.

## Entregable

- `extractSteps` + tests con 3 expresiones (una con resultado parcial).

## Criterios de aceptación

- [ ] Para `d/dx sin(x^2)` → al menos 2 pasos (chain rule + simplificación).
- [ ] Para expresiones donde cortex no resuelve, al menos 1 paso parcial.
- [ ] Cada paso tiene `latex` válido (parseable por KaTeX).
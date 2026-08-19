# Task 07-T02 — Soporte para derivadas (`D`) y límites (`Limit`)

- **Paso:** 07 — Servicio motor simbólico
- **Tiempo estimado:** 3 horas
- **Depende de:** 07-T01

## Contexto

Plan paso 07 líneas 50-54.

## Alcance

- `packages/shared/src/engine/operations.ts`:
  ```ts
  export function derivative(latex: string, variable = 'x'): EngineResult;
  export function limit(latex: string, point: string, dir: '+|-' | 'both' = 'both'): EngineResult;
  ```
- Usa `ce.box(['D', expr, variable])` y `ce.box(['Limit', expr, var, point, dir])`.
- Devuelve LaTeX serializado (`expr.toLatex()`) y pasos.

## Entregable

- Dos funciones exportadas y testeadas contra derivadas/límites del paso 01.

## Criterios de aceptación

- [ ] 5/5 derivadas del paso 01 retornan resultado correcto.
- [ ] 5/5 límites correctos.
- [ ] Si no resuelve, `ok: false, partial: true, steps: [...]`.
- [ ] `partial=true` cuando hay expresión "estancada" en `steps[-1]`.
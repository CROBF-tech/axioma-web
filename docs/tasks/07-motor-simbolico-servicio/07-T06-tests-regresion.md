# Task 07-T06 — Tests de regresión con set del paso 01

- **Paso:** 07 — Servicio motor simbólico
- **Tiempo estimado:** 2 horas
- **Depende de:** 07-T05

## Contexto

Plan paso 07 línea 65. Regresión continua.

## Alcance

- Test suite que recorre `tools/exercises.ts` y llama a `compute()`.
- Asserts:
  - Si el motor debe resolverlo: `result.ok === true && !result.partial`.
  - Si no: `result.partial === true && result.steps.length > 0`.
- Snapshot del set en `engine/__tests__/exercises.json`.

## Entregable

- `packages/shared/src/engine/__tests__/exercises.test.ts`.
- Script `test:engine`.

## Criterios de aceptación

- [ ] Tests pasan localmente con la decisión vigente.
- [ ] CI corre el set.
- [ ] Fallo en un ejercicio es descriptivo.
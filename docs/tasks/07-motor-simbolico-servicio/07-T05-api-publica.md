# Task 07-T05 — Tipos `EngineResult`, `ComputeInput` y export único `compute()`

- **Paso:** 07 — Servicio motor simbólico
- **Tiempo estimado:** 1 hora
- **Depende de:** 07-T03, 07-T04

## Contexto

Plan paso 07 líneas 23-45, 65.

## Alcance

- `packages/shared/src/engine/types.ts` con:
  ```ts
  export type Step = { label: string; latex: string; rule?: string };
  export type EngineResult = { ok: boolean; latex?: string; steps: Step[]; partial?: boolean; engine: 'cortex'|'nerdamer'; error?: { message: string; until?: string } };
  export type ComputeInput = { kind: 'derivative'|'integral'|'limit'|'simplify'|'evaluate'; expr: string; variable?: string; bounds?: [string,string]; point?: string };
  export type ComputeOutput = EngineResult;
  ```
- `packages/shared/src/engine/index.ts` exporta `compute(input: ComputeInput): EngineResult` que dispatcha por `input.kind`.

## Entregable

- API pública final.

## Criterios de aceptación

- [ ] `compute({ kind: 'derivative', expr: 'x^2' })` funciona.
- [ ] Tipos están exportados desde `@shared/engine`.
- [ ] Import único desde web/api.
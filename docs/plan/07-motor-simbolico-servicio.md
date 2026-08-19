# Paso 07 — Servicio del motor simbólico

## Objetivo

Encapsular el motor (`@cortex-js/compute-engine` + fallback `nerdamer` para integrales) en un servicio reutilizable tanto en frontend como backend, con salida estructurada que incluya **paso a paso parcial**.

## Fundamento del paso 01

Depende de `tools/RESULTADOS.md` (paso 01). Si el reporte recomendó fallback, este paso lo integra.

## Estructura

```
packages/shared/src/engine/
├── index.ts          # API pública
├── compute.ts        # wrapper ComputeEngine
├── fallback.ts       # nerdamer para integrales
├── steps.ts          # extracción de pasos
└── types.ts          # EngineResult, Step
```

## API pública

```ts
type EngineResult = {
  ok: boolean;
  latex?: string;            // resultado en LaTeX
  mathJson?: Expr;           // resultado simbólico
  steps: Step[];             // paso a paso (parcial si falla)
  partial?: boolean;         // true si no se completó
  engine: 'cortex' | 'nerdamer';
  error?: { message: string; until?: string };
};

type Step = { label: string; latex: string; rule?: string };

export function compute(input: ComputeInput): EngineResult;
export type ComputeInput = {
  kind: 'derivative' | 'integral' | 'limit' | 'simplify' | 'evaluate';
  expr: string;              // LaTeX de entrada
  variable?: string;
  bounds?: [string, string];  // integrales definidas
  point?: string;            // límites
};
```

## Flujo

1. Parsear LaTeX → MathJSON con `ce.parse(input.expr)`.
2. Construir expresión según `kind` (`D`, `Integrate`, `Limit`...).
3. `ce.canonical(expr)` + `ce.simplify`.
4. Intentar resolver:
   - **Derivadas / límites / simplificación:** compute-engine directo.
   - **Integrales:** compute-engine primero; si `partial === true` o error, intentar `nerdamer.integrate`.
5. Capturar `expr.steps` (o árbol de derivación) → `Step[]`.
6. Si nada funciona: `ok=false`, `partial=true`, `error.until = <última subexpr>`.

## Render del paso a paso (frontend, paso 08)
El servicio devuelve `steps` en LaTeX; la UI los muestra con KaTeX en una lista colapsable. **Nunca** se muestra error genérico: si `partial`, se renderiza "Resuelto hasta: <paso>".

## Entregables

- `packages/shared/src/engine/*`.
- Tests unitarios con el set del paso 01 como regresión.
- Export único `compute()` usado desde web y api.

## Criterios de aceptación

- [ ] 100% de los ejercicios del paso 01 devuelven `EngineResult` (no throw).
- [ ] Casos no resueltos devuelven `partial=true` con `steps` no vacío.
- [ ] `nerdamer` solo se invoca para integrales y solo cuando compute-engine falla.
- [ ] Bundle del engine es lazy (no carga nerdamer si no hace falta).
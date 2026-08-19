# Task 07-T01 — Wrapper ComputeEngine: parse LaTeX → MathJSON

- **Paso:** 07 — Servicio motor simbólico
- **Tiempo estimado:** 2 horas
- **Depende de:** 01-T06, 02-T06

## Contexto

Plan paso 07 líneas 49-56. Punto de entrada del servicio en `packages/shared`.

## Alcance

- Crear `packages/shared/src/engine/compute.ts`:
  ```ts
  import { ComputeEngine } from '@cortex-js/compute-engine';
  const ce = new ComputeEngine();

  export function parse(latex: string): Expr | { error: string } {
    try { return ce.parse(latex); }
    catch (e) { return { error: (e as Error).message }; }
  }
  ```
- Exportar instancia `ce` (lazy-init).

## Entregable

- `compute.ts` con `parse` robusto.

## Criterios de aceptación

- [ ] `parse('\\frac{1}{x}')` devuelve expresión MathJSON.
- [ ] `parse('x^(')` devuelve `{ error: ... }` sin throw.
- [ ] Re-importar no reinstancia `ce`.
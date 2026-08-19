# Task 01-T02 — Definir set de ejercicios con esperados

- **Paso:** 01 — Validación del motor simbólico
- **Tiempo estimado:** 2 horas
- **Depende de:** 01-T01

## Contexto

Plan paso 01 líneas 26-50 listan ≥15 ejercicios a evaluar.

## Alcance

Crear `tools/exercises.ts` con:
```ts
export type Exercise = {
  id: string;
  category: 'derivative' | 'limit' | 'integral';
  latex: string;                  // expresión de entrada
  expected: string;                // LaTeX esperado (puede ser aproximación textual)
  tolerance?: number;              // default 1e-6
  domain?: [number, number];       // para evaluación numérica
  indefinite?: boolean;            // integral indefinida (true) o definida
};

export const exercises: Exercise[] = [...];
```
Cubrir:
- 5 derivadas (racional, composición, producto+log, trig invertida).
- 5 límites (los clásicos `sin(x)/x`, `(1+1/n)^n`, e^x -1 / x, etc.).
- 5-8 integrales (por partes, fracciones parciales, trig, log).

## Entregable

- `tools/exercises.ts` exportando array tipado.
- Total ≥15 ejercicios, sumando todas las categorías.

## Criterios de aceptación

- [ ] ≥5 derivadas, ≥5 límites, ≥5 integrales.
- [ ] Cada `expected` es una expresión correcta en LaTeX (revisada a mano).
- [ ] Cada ejercicio tiene `id` único.
- [ ] El array es `readonly` y type-safe (`as const` o `satisfies Exercise[]`).
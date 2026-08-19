# Task 01-T03 — Implementar comparador simbólico y numérico

- **Paso:** 01 — Validación del motor simbólico
- **Tiempo estimado:** 3 horas
- **Depende de:** 01-T02

## Contexto

Plan paso 01 líneas 53-54. Necesitamos dos modos de comparación: simbólica (más estricta) y numérica (más laxa).

## Alcance

Crear `tools/compare.ts` con:
```ts
export function compareSymbolic(result: string, expected: string): boolean;
export function compareNumeric(result: string, expected: string, domain: [number, number]): boolean;
```

- **Simbólica:** si la diferencia canónica `simplify(result - expected)` es `0`, ✓.
- **Numérica:** 5 muestras aleatorias en `domain`, evalúa ambos, compara con tolerancia `1e-6`.

Usar `@cortex-js/compute-engine` para ambos modos (simplify + evaluate).

## Entregable

- `tools/compare.ts` con dos funciones puras.
- Tests con 5+ pares conocidos: `(x^2, x^2)` ✓, `(x^2+0, x^2)` ✓, `(x^2+1, x^2)` ✗.

## Criterios de aceptación

- [ ] `compareSymbolic('x^2+0', 'x^2')` retorna `true`.
- [ ] `compareSymbolic('x^2+1', 'x^2')` retorna `false`.
- [ ] `compareNumeric('sin(x)', 'sin(x)', [-1, 1])` retorna `true`.
- [ ] `compareNumeric('2x', 'x^2', [1, 5])` retorna `false` en al menos una muestra.
- [ ] No importa mayúsculas/minúsculas en LaTeX (`\Sin` vs `\sin`).
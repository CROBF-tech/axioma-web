# Task 09-T02 — Parseo LaTeX → función JS evaluable

- **Paso:** 09 — Gráficos function-plot
- **Tiempo estimado:** 3 horas
- **Depende de:** 09-T01

## Contexto

Plan paso 09 líneas 32-34. function-plot espera `data[i].fn` como string JS evaluable (`x => Math.sin(x)` no — sino `sin(x)`).

## Alcance

- Función `latexToJsExpr(latex: string): string`:
  - Sustituir `\sin`, `\cos`, etc. → `Math.sin`, etc.
  - `\frac{a}{b}` → `(a/b)`.
  - `^{n}` → `**n`.
- Validar evitando funciones peligrosas (`eval` no se usa; solo se construye string).

## Entregable

- Helper `parser.ts` con tests unitarios.

## Criterios de aceptación

- [ ] `latexToJsExpr('\\sin(x)')` retorna `'Math.sin(x)'`.
- [ ] `latexToJsExpr('x^2')` retorna `'x**2'`.
- [ ] Pipeline completo: `sin(x)` → `Math.sin(x)` y grafica OK.
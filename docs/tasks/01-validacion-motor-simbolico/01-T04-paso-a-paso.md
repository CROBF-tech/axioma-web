# Task 01-T04 — Capturar paso a paso parcial en fallos

- **Paso:** 01 — Validación del motor simbólico
- **Tiempo estimado:** 2 horas
- **Depende de:** 01-T03

## Contexto

Spec línea 42: "Si el motor no puede resolver algo simbólicamente por completo: mostrar el paso a paso hasta donde llegó". El script de validación debe capturar esto para validar el comportamiento.

## Alcance

- En `tools/validate-engine.ts`, cuando una operación falla o devuelve `partial=true`, capturar `expr.steps` o el árbol de evaluación parcial.
- Almacenar en el reporte: lista de pasos con su `LaTeX` y regla aplicada.
- Si no hay pasos parciales, marcar como `no_partial_info`.

## Entregable

- Bloque en el reporte por cada fallo con:
  ```ts
  type StepInfo = { label: string; latex: string; rule?: string };
  ```
- Mensaje "No pude resolver por completo; llegué hasta: <última expr en LaTeX>".

## Criterios de aceptación

- [ ] Cuando el motor no resuelve, el reporte incluye al menos 1 paso parcial o `no_partial_info: true`.
- [ ] El paso capturado es **string** LaTeX listo para KaTeX.
- [ ] Para los ejercicios resueltos OK, `steps` queda vacío o se omite.
- [ ] El reporte es parseable (JSON o YAML estructurado).
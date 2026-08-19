# Paso 09 — Gráficos 2D con function-plot

## Objetivo

Celda de tipo `plot` que grafica funciones 2D con zoom, pan y múltiples funciones superpuestas.

## Skill / docs

- `function-plot` (librería). No hay skill específica; usar docs oficiales + Context7 si está disponible.
- Integración con d3 subyacente.

## Tipo de celda
```ts
type PlotCell = Cell & {
  kind: 'plot';
  input: string;                // expresión a graficar (puede venir de refs)
  output?: { specs: PlotSpec[] };
};
type PlotSpec = { fn: string; color?: string; label?: string; domain?: [number, number] };
```

## Componente
```
apps/web/src/features/notebook/cells/PlotCell.tsx
```
- Monta un `<div>` contenedor; `functionPlot({ target, data, ... })`.
- `data: specs.map(s => ({ fn: s.fn, color: s.color ?? accent }))`.
- Zoom y pan habilitados (`tip: { xLine: true, yLine: true }`).
- Múltiples funciones: separadas por `;` en el input o añadidas vía refs.
- Re-render al cambiar accent (usa el token `--accent`).

## Preparación de la función
- Parsear input LaTeX → expresión JS evaluable. Usar `compute-engine` para simplificar y luego serializar a string JS-compatible, o usar `nerdamer`'s `buildFunction`.
- Validar dominio y puntos singulares para evitar `Infinity` loops.

## Entregables

- `PlotCell` integrado en el notebook.
- Gráfico de `sin(x)` con zoom/pan.
- Dos funciones superpuestas con colores distintos.

## Criterios de aceptación

- [ ] Plot de `sin(x)` renderiza correctamente.
- [ ] Zoom con rueda, pan con drag.
- [ ] `sin(x); cos(x)` muestra ambas.
- [ ] Tooltip coords `(x, y)`.
- [ ] No crashea con funciones discontinuas (`1/x`): muestra asíntotas razonablemente.
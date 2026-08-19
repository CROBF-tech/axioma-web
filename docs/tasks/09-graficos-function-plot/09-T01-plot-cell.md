# Task 09-T01 — Componente `PlotCell` con contenedor y reinstancia

- **Paso:** 09 — Gráficos function-plot
- **Tiempo estimado:** 2 horas
- **Depende de:** 08-T03

## Contexto

Plan paso 09 líneas 22-30. Deps: `function-plot`.

## Alcance

- `<PlotCell cell={Cell} />` con `useEffect` que monta/cambia `functionPlot({ target: ref.current, data })`.
- Al desmontar o cambiar input, destruir instance previa.
- Aceptar cambio de accent o tamaño con re-render.

## Entregable

- Componente base.

## Criterios de aceptación

- [ ] Plot de `sin(x)` renderiza.
- [ ] Cambiar input re-renderiza sin leaks (sin `<canvas>` huérfanos).
- [ ] Cambiar accent recolorea.
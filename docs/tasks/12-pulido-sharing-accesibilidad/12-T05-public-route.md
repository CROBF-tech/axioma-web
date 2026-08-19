# Task 12-T05 — Ruta pública `/s/:slug` solo lectura

- **Paso:** 12 — Pulido, sharing, a11y
- **Tiempo estimado:** 3 horas
- **Depende de:** 12-T04

## Contexto

Plan paso 12 líneas 16-17.

## Alcance

- Backend: `GET /public/notebooks/:slug` (sin auth) → notebook snapshot con todas sus celdas.
- Frontend: ruta `/s/:slug` que reusa `<NotebookView>` con prop `readOnly={true}`.
- En readOnly: oculta botones de edición, ejecución de celda **permitida** (cliente) pero no se persiste.

## Entregable

- Página pública.

## Criterios de aceptación

- [ ] Sin login, abrir `/s/<slug>` muestra el notebook.
- [ ] No se ven botones de edición.
- [ ] Ejecutar una celda solo ocurre en memoria (no se persiste, no requiere sub).
- [ ] Si el slug no existe o está desactivado → 404.
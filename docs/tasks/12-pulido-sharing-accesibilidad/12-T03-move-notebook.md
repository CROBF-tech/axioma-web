# Task 12-T03 — Mover notebook entre carpetas

- **Paso:** 12 — Pulido, sharing, a11y
- **Tiempo estimado:** 1 hora
- **Depende de:** 12-T01, 12-T02

## Contexto

Plan paso 12 línea 11.

## Alcance

- Drag notebook sobre un folder en el árbol, o selector "Mover a...".
- Backend: `PATCH /api/notebooks/:id { folderId }`.

## Entregable

- Movimiento funcional.

## Criterios de aceptación

- [ ] Drag & drop mueve el notebook.
- [ ] Notebooks en raíz aparecen si `folderId === null`.
# Task 08-T01 — Definir contrato REST de notebooks/cells

- **Paso:** 08 — Notebook UI celdas
- **Tiempo estimado:** 1 hora
- **Depende de:** 05-T07

## Contexto

Inconsistencias D2 y D6 del plan. Definir contrato antes de implementar UI.

## Alcance

- Documento en `apps/api/src/routes/notebooks.contract.md`:
  ```
  GET    /api/notebooks                  → listar (con paginación)
  POST   /api/notebooks                  → crear
  GET    /api/notebooks/:id              → obtener (con cells)
  PATCH  /api/notebooks/:id              → actualizar título/accent/folderId
  DELETE /api/notebooks/:id              → eliminar
  POST   /api/notebooks/:id/cells        → crear celda
  PATCH  /api/cells/:id                  → input/output/references/orderIdx
  DELETE /api/cells/:id                  → eliminar
  POST   /api/notebooks/:id/reorder      → body { order: string[] } (ids)
  ```
- Request/Response shapes (zod).
- Compartir a `@shared/api/types.ts`.

## Entregable

- Contrato + tipos compartidos.

## Criterios de aceptación

- [ ] Cada ruta documentada con: método, path, auth, request, response, errores.
- [ ] Tipos exportados a `@shared/api`.
- [ ] Frontend y backend usan los mismos tipos.
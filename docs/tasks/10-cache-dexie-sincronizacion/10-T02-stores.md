# Task 10-T02 — Definir stores (`notebooks`, `cells`, `folders`, `syncQueue`)

- **Paso:** 10 — Caché Dexie + sync
- **Tiempo estimado:** 2 horas
- **Depende de:** 10-T01

## Contexto

Plan paso 10 líneas 23-28. Igual al paso 05-T02 pero replicado local.

## Alcance

- Tipos TypeScript para cada store, consistentes con `@shared/types`.
- `db.notebooks.add({...})` etc. con tipado correcto.
- `syncQueue` shape:
  ```ts
  { entity: 'notebook'|'cell'|'folder'; entityId: string; op: 'create'|'update'|'delete'; payload: unknown; createdAt: number }
  ```

## Entregable

- Helpers `getNotebookFromCache(id)`, `saveCellToCache(...)`.

## Criterios de aceptación

- [ ] Insertar desde cache y leer de vuelta mantiene tipos.
- [ ] `syncQueue` autogenera IDs.
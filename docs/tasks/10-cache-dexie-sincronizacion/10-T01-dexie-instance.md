# Task 10-T01 — Instalar y crear instancia Dexie

- **Paso:** 10 — Caché Dexie + sync
- **Tiempo estimado:** 1 hora
- **Depende de:** 08-T01

## Contexto

Plan paso 10 líneas 21-28. Deps: `dexie`.

## Alcance

- `apps/web/src/data/db.ts`:
  ```ts
  import Dexie from 'dexie';
  export const db = new Dexie('axioma');
  db.version(1).stores({
    notebooks: 'id, ownerId, updatedAt',
    cells: 'id, notebookId, orderIdx, updatedAt',
    folders: 'id, ownerId',
    syncQueue: '++id, entity, op, createdAt',
  });
  ```

## Entregable

- Instancia exportada.

## Criterios de aceptación

- [ ] DevTools → Application → IndexedDB muestra DB `axioma` con las 4 stores.
- [ ] Importar la DB no rompe en SSR (si se usa).
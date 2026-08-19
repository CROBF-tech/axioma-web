# Paso 10 — Caché local con Dexie + sincronización

## Objetivo

Offline-first parcial: el frontend cachea notebooks en Dexie (no es fuente de verdad) y sincroniza con el backend cuando hay conexión. Multi-dispositivo coherente.

## Skills usadas

- `dexiejs` (instalada, `devfirexyz/skills@dexiejs`).
- Docs Context7 `/websites/dexie`.

## Modelo de sincronización

- **Fuente de verdad:** backend (Turso).
- **Caché:** Dexie en `apps/web`. Toda lectura pasa por Dexie; si está vacía o stale, fetch al backend y write-through a Dexie.
- **Escritura:** optimista. Update local inmediato → enqueue sync → `PATCH` al backend. Si falla, rollback + marca conflicto.
- **Conflicto:** `updated_at` por campo; gana el más nuevo. Conflictos a nivel celda son raros (edición individual); usar `If-Match: updated_at` en el backend.

## Schema Dexie

```ts
db.version(1).stores({
  notebooks: 'id, owner_id, updated_at',
  cells: 'id, notebook_id, order_idx, updated_at',
  folders: 'id, owner_id',
  syncQueue: '++id, entity, op, createdAt',
});
```

## Capa

```
apps/web/src/data/
├── db.ts                # Dexie instance
├── repository.ts        # getNotebook, saveCell, etc. (Dexie-first; usa @axioma/db para backend)
├── sync.ts              # processSyncQueue, online/offline listener
└── hooks.ts             # useNotebook(id), useCells(notebookId)
```

El `repository.ts` del frontend usa `@axioma/db` como capa de acceso al servidor. Como `@axioma/db` detecta el entorno, en el navegador sus funciones ya son `fetch` a `VITE_API_URL`, manteniendo el frontend libre de credenciales de Turso.

## Online/offline
- `navigator.onLine` + eventos `online`/`offline`.
- En offline: writes van solo a Dexie + queue.
- Al volver online: procesa `syncQueue` en orden.

## Entregables

- `repository.ts` que todo el UI usa (sin fetch directo; consume `@axioma/db`).
- `sync.ts` con procesador de cola.
- UI: indicador "Sin conexión — cambios pendientes".
- Test: editar offline → reconectar → recargar en otro tab → datos consistentes.
- Verificación de que `@axioma/db` en el frontend solo genera requests HTTP y no carga `@libsql/client`.

## Criterios de aceptación

- [ ] Abrir notebook sin red (cargado antes) funciona.
- [ ] Editar offline encola y al reconectar sincroniza.
- [ ] Editar la misma celda en dos tabs: el más reciente gana, sin crash.
- [ ] `syncQueue` vacía después de sync exitosa.
- [ ] `repository.ts` consume `@axioma/db`, no hace `fetch` directo.
- [ ] El bundle de `apps/web` no incluye `@libsql/client` ni código de conexión a Turso.
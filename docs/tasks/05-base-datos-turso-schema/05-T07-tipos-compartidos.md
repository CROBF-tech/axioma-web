# Task 05-T07 — Exportar tipos a `packages/shared`

- **Paso:** 05 — Base de datos Turso + schema
- **Tiempo estimado:** 1 hora
- **Depende de:** 05-T04, 02-T06

## Contexto

Plan paso 05 línea 97, 92.

## Alcance

- Usar `InferSelectModel`/`InferInsertModel` de Drizzle para generar tipos.
- Re-exportar desde `packages/shared/src/index.ts`:
  ```ts
  export type Notebook = InferSelectModel<typeof notebooks>;
  export type NewNotebook = InferInsertModel<typeof notebooks>;
  export type Cell = InferSelectModel<typeof cells>;
  // ...idem folders, subscriptions
  ```
- `@axioma/shared` debe depender de `drizzle-orm` types (peer dep / dev dep type-only).
- `@axioma/db` re-exporta tipos inferidos para que el backend los use sin importar `packages/shared`.

## Entregable

- `packages/shared/src/types/db.ts` con tipos inferidos.

## Criterios de aceptación

- [ ] Import en web/app sin warning de circularidad.
- [ ] Editar schema propaga el tipo en ambas apps.
- [ ] Drizzle types no se filtran al bundle de frontend (son type-only).
- [ ] `@axioma/db` exporta tipos type-safe para ambos entornos.
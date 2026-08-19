# Task 05-T02 — Definir schema `notebooks` y `cells`

- **Paso:** 05 — Base de datos Turso + schema
- **Tiempo estimado:** 2 horas
- **Depende de:** 05-T01

## Contexto

Plan paso 05 líneas 28-63.

## Alcance

- `packages/db/src/schema.ts` con Drizzle:
  ```ts
  export const notebooks = sqliteTable('notebooks', {
    id: text('id').primaryKey(),
    ownerId: text('owner_id').notNull(),
    title: text('title').notNull(),
    folderId: text('folder_id'),
    accent: text('accent'),
    isPublic: integer('is_public', { mode: 'boolean' }).default(false),
    publicSlug: text('public_slug').unique(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  });
  export const cells = sqliteTable('cells', {
    id: text('id').primaryKey(),
    notebookId: text('notebook_id').notNull().references(() => notebooks.id, { onDelete: 'cascade' }),
    orderIdx: integer('order_idx').notNull(),
    kind: text('kind', { enum: ['math','text','plot'] }).notNull(),
    input: text('input').notNull(),
    output: text('output'),
    references: text('references'),  // JSON
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  });
  ```
- Índices en `notebooks.ownerId`, `cells.notebookId+orderIdx`.
- El schema se coloca en `packages/db/src/schema.ts` para que `@axioma/db` lo comparta con frontend y backend.

## Entregable

- `schema.ts` con las dos tablas.

## Criterios de aceptación

- [ ] `drizzle-kit push` aplica las tablas.
- [ ] FK `cells.notebookId → notebooks.id` con `ON DELETE CASCADE`.
- [ ] Tipos inferidos exportados (`InferSelectModel`).
- [ ] `apps/api` puede importar el schema desde `@axioma/db/schema`.
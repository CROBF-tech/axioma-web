# Task 05-T03 — Definir schema `folders` (árbol)

- **Paso:** 05 — Base de datos Turso + schema
- **Tiempo estimado:** 1 hora
- **Depende de:** 05-T02

## Contexto

Plan paso 05 líneas 41-48.

## Alcance

```ts
export const folders = sqliteTable('folders', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  name: text('name').notNull(),
  parentId: text('parent_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```
- `parentId` auto-referencia, FK con `ON DELETE SET NULL`.
- Índice en `folders.ownerId`.

## Entregable

- Tabla + índice.

## Criterios de aceptación

- [ ] `drizzle-kit push` aplica.
- [ ] Borrar un folder padre no borra hijos (queda huérfano).
- [ ] Tipo `Folder` inferido.
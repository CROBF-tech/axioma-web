# Task 02-T06 — Crear `packages/shared` con tipos base

- **Paso:** 02 — Estructura del monorepo
- **Tiempo estimado:** 1 hora
- **Depende de:** 02-T01, 02-T02

## Contexto

Plan paso 02 línea 30, 71: tipos `Notebook`, `Cell` compartidos. TypeScript-only (sin runtime significativo en MVP).

## Alcance

- Crear `packages/shared/package.json` con `type: module` y main `./src/index.ts`.
- Crear `packages/shared/src/index.ts` con:
  ```ts
  export type ID = string;
  export type CellKind = 'math' | 'text' | 'plot';
  export interface Cell { id: ID; kind: CellKind; input: string; order_idx: number; refs: ID[]; createdAt: number; updatedAt: number; }
  export interface Notebook { id: ID; ownerId: ID; title: string; folderId?: ID; accent?: string; isPublic: boolean; publicSlug?: string; cells: Cell[]; createdAt: number; updatedAt: number; }
  export interface Folder { id: ID; ownerId: ID; name: string; parentId?: ID; createdAt: number; }
  ```
- Configurar para que `@shared/types` resuelva desde ambos apps.

## Entregable

- `packages/shared` publicado internamente, importable desde `@shared/*`.
- `packages/db` publicado internamente, importable desde `@axioma/db`.

## Criterios de aceptación

- [ ] `apps/web` puede hacer `import type { Cell } from '@shared/types';`.
- [ ] Ambas apps pueden hacer `import { createDb } from '@axioma/db'` sin error de resolución.
- [ ] `apps/api` puede hacer lo mismo.
- [ ] `tsc --noEmit` pasa en ambos.
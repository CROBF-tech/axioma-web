# Task 12-T12 — Página 404 + error genérico + loading/empty states

- **Paso:** 12 — Pulido, sharing, a11y
- **Tiempo estimado:** 2 horas
- **Depende de:** 03-T05

## Contexto

Plan paso 12 líneas 38-42.

## Alcance

- Página `/404` minimalista con link "Volver".
- Página `/error` (error boundary) genérica.
- Skeletons: `<NotebookSkeleton />`, `<LibrarySkeleton />`.
- Empty states: "Sin notebooks todavía — crea el primero".

## Entregable

- Conjunto de estados.

## Criterios de aceptación

- [ ] Ruta desconocida → 404 + UI coherente.
- [ ] Throw en render → page-level error visible.
- [ ] Loading y empty visibles en su contexto.
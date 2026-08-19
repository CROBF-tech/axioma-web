# Task 09-T05 — Color desde accent token (`--accent`)

- **Paso:** 09 — Gráficos function-plot
- **Tiempo estimado:** 1 hora
- **Depende de:** 09-T03, 03-T02

## Contexto

Plan paso 09 línea 30.

## Alcance

- Leer `getComputedStyle(document.documentElement).getPropertyValue('--accent')` al montar.
- Re-leer al cambiar accent (`MutationObserver` sobre `data-accent`).
- Asignar como `color` para cada `data[i]`.

## Entregable

- Plot reacciona al accent.

## Criterios de aceptación

- [ ] Plot usa el color accent actual.
- [ ] Cambiar accent desde settings actualiza el plot sin re-mount.
- [ ] Modo oscuro no afecta el accent.
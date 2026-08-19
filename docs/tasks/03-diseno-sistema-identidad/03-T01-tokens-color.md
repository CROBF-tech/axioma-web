# Task 03-T01 — Definir variables CSS base (tokens de color)

- **Paso:** 03 — Diseño e identidad visual
- **Tiempo estimado:** 1 hora
- **Depende de:** 02-T04

## Contexto

Plan paso 03 líneas 23-44. Spec: alto contraste, fondo blanco/negro, accent configurable.

## Alcance

- Crear `apps/web/src/styles/tokens.css`:
  ```css
  @theme inline {
    --color-bg: var(--bg);
    --color-fg: var(--fg);
    --color-accent: var(--accent);
    --color-muted: var(--muted);
    --color-border: var(--border);
  }
  ```
- Variables en `:root.light` y `:root.dark`.
- `--accent: var(--accent-user)` (override desde JS, ver 03-T02).

## Entregable

- `tokens.css` con tokens.
- Definición de modo claro/oscuro vía `data-theme="light|dark"` en `<html>`.

## Criterios de aceptación

- [ ] Toggle manual de `data-theme` en `<html>` cambia fondo y texto sin recargar.
- [ ] Accent por defecto es un color de alto contraste AA contra bg/fg en ambos modos.
- [ ] Todos los componentes usan `bg-bg`, `text-fg`, `text-accent` etc., nunca colores crudos.
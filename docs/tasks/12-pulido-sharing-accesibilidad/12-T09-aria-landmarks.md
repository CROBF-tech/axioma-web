# Task 12-T09 — Skip links y landmark roles ARIA

- **Paso:** 12 — Pulido, sharing, a11y
- **Tiempo estimado:** 1 hora
- **Depende de:** 12-T08

## Contexto

Plan paso 12 línea 26.

## Alcance

- `<a href="#main" class="skip-link">Saltar al contenido</a>` visible al focus.
- `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` con roles correctos.
- `aria-label` en iconos.

## Entregable

- Layout base accesible.

## Criterios de aceptación

- [ ] Lector de pantalla identifica landmarks.
- [ ] Tab muestra skip link y salta al contenido.
- [ ] axe no reporta `landmark-*` violations.
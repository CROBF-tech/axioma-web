# Task 02-T04 — Scaffold `apps/web` con Vite + React + TS

- **Paso:** 02 — Estructura del monorepo
- **Tiempo estimado:** 1 hora
- **Depende de:** 02-T01, 02-T02

## Contexto

Plan paso 02 línea 46: bundler Vite. Sin plantilla/boilerplate: armado a mano.

## Alcance

- Crear `apps/web/package.json` con name `@axioma/web`, scripts:
  - `dev`: `vite`
  - `build`: `tsc --noEmit && vite build`
  - `preview`: `vite preview`
- Crear `apps/web/index.html` mínimo con `<div id="root">`.
- Crear `apps/web/src/main.tsx` montando `<App />`.
- Crear `apps/web/vite.config.ts` con alias `@web`.
- Deps: `react`, `react-dom`, `vite`, `@vitejs/plugin-react`.

## Entregable

- `apps/web` funcional que muestra "Hello Axioma" en `localhost:5173`.

## Criterios de aceptación

- [ ] `bun --filter @axioma/web dev` levanta Vite.
- [ ] Página carga sin error en consola del navegador.
- [ ] TS typecheck pasa.
- [ ] No hay boilerplate de frameworks (sin SSR, sin router preinstalado).
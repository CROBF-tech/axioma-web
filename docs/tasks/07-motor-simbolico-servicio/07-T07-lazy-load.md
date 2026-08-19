# Task 07-T07 — Lazy-load de nerdamer (code-split)

- **Paso:** 07 — Servicio motor simbólico
- **Tiempo estimado:** 1 hora
- **Depende de:** 07-T03

## Contexto

Plan paso 07 línea 67 (entregable): "Bundle del engine es lazy".

## Alcance

- Web: importar `nerdamer` solo cuando fallback se ejecuta (dynamic `import()`).
- Backend: `nerdamer` puede estar eagerly, pero igualmente tree-shaking del flujo cortex evita cargarlo si no hace falta.
- Verificar bundle del frontend con `vite build` y `analyze`.

## Entregable

- Reporte de bundle con/sin fallback esperado.
- Script `bun build:analyze` (opcional).

## Criterios de aceptación

- [ ] `vite build` con un test que **no** ejecuta integrales NO incluye `nerdamer` en el bundle principal.
- [ ] Cuando se ejecuta una integral con fallback, el chunk de nerdamer se carga dinámicamente.
# Task 03-T02 — Implementar `ThemeProvider` (claro/oscuro + accent)

- **Paso:** 03 — Diseño e identidad visual
- **Tiempo estimado:** 2 horas
- **Depende de:** 03-T01

## Contexto

Plan paso 03 líneas 46-57.

## Alcance

- `apps/web/src/theme/provider.tsx` que wrappea la app con `<ThemeProvider>`.
- Lee de `localStorage.axioma.theme` (light/dark/system).
- Lee de `localStorage.axioma.accent` (color hex).
- Aplica `data-theme` a `<html>` y `--accent` como CSS var inline.
- Sistema: usa `prefers-color-scheme`.

## Entregable

- Provider + hook `useTheme()`.

## Criterios de aceptación

- [ ] Llamar `setTheme('dark')` actualiza `data-theme` sin recarga.
- [ ] Cambiar `setAccent('#ff0000')` actualiza el color accent globalmente.
- [ ] Recargar la página persiste la elección.
- [ ] Modo `system` se aplica al cargar sin preferencia guardada.
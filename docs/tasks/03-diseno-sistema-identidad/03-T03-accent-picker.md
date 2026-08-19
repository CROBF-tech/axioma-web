# Task 03-T03 — Crear `AccentPicker`

- **Paso:** 03 — Diseño e identidad visual
- **Tiempo estimado:** 1 hora
- **Depende de:** 03-T02

## Contexto

Plan paso 03 línea 49.

## Alcance

- Componente `<AccentPicker />` que muestra presets (6-8 colores) y un input custom.
- Al seleccionar, llama a `setAccent()`.
- Vista `/settings/accent` lo contiene.

## Entregable

- `apps/web/src/theme/AccentPicker.tsx`.
- Ruta `/settings/accent`.

## Criterios de aceptación

- [ ] Click en preset actualiza inmediatamente `--accent` en todos los componentes.
- [ ] Color custom se acepta en formato hex válido.
- [ ] Selección persiste tras recarga.
- [ ] Botón "Restablecer" vuelve al accent por defecto.
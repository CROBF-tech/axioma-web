# Task 12-T04 — Toggle "Compartir públicamente" + generar `public_slug`

- **Paso:** 12 — Pulido, sharing, a11y
- **Tiempo estimado:** 2 horas
- **Depende de:** 12-T01

## Contexto

Plan paso 12 líneas 14-15. Inconsistencia D8: slug no-enumerable.

## Alcance

- Toggle en settings del notebook.
- Genera `public_slug` con `nanoid(22)` o similar (≥22 caracteres base62).
- Botón "Copiar link" → `https://app.axioma.com/s/<slug>`.

## Entregable

- Toggle + link.

## Criterios de aceptación

- [ ] Activar toggle genera slug único.
- [ ] Slug tiene ≥22 caracteres alfanuméricos.
- [ ] Desactivar toggle pone `is_public = false` y `public_slug = null`.
- [ ] Reactivar genera slug nuevo (no reutiliza).
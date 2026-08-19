# Task 01-T06 — Generar reporte `RESULTADOS.md` con decisión

- **Paso:** 01 — Validación del motor simbólico
- **Tiempo estimado:** 1 hora
- **Depende de:** 01-T05

## Contexto

Plan paso 01 línea 71: `tools/RESULTADOS.md` con reporte + decisión firmada.

## Alcance

Generar **automáticamente** desde `tools/validate-engine.ts`:

- Tabla de tasa de éxito por categoría (derivadas/límites/integrales).
- Lista de IDs fallidos, con sus pasos parciales.
- Decisión final: `cortex_only` o `cortex_plus_nerdamer`.
- Recomendación: proceder al paso 02 o replantear.

## Entregable

- `tools/RESULTADOS.md` actualizado por el script.
- Bloque de "Decisión firmada" con timestamp.

## Criterios de aceptación

- [ ] `RESULTADOS.md` existe y se regenera cada corrida.
- [ ] Tabla Markdown legible con tasa global y por categoría.
- [ ] Decisión explícita: `<motor>A</motor> + <motor>B</motor>` o `cortex_only`.
- [ ] Si la decisión es `cortex_plus_nerdamer`, justificación numérica (cuántas integrales cubre nerfdamper que cortex no).
- [ ] Si tasa global <80%, el reporte recomienda **no avanzar al paso 02**.
# Task 01-T05 — Probar fallback con nerdamer si falla ≥2 integrales

- **Paso:** 01 — Validación del motor simbólico
- **Tiempo estimado:** 2 horas
- **Depende de:** 01-T03

## Contexto

Plan paso 01 línea 5: "Si falla ≥2 integrales → integrar nerdamer". Esto valida que el fallback cubre los huecos.

## Alcance

- En `tools/validate-engine.ts`, agregar una segunda pasada para integrales: si `compute-engine` falló o dio parcial, intentar `nerdamer.integrate(expr, var).toString()`.
- Comparar resultado con `expected` usando el comparador.
- Reportar para cada integral: `cortex_ok`, `nerdamer_ok`, `partial`, `both_failed`.

## Entregable

- Modificación de `tools/validate-engine.ts` que ejecuta la pasada doble.
- Bloque de salida formateado por integral.

## Criterios de aceptación

- [ ] Si ambos motores fallan en una integral, output reporta `both_failed: true` con `PartialEvaluation` no nulo.
- [ ] Si `nerdamer` resuelve lo que `cortex` no, output reporta el crédito a nerdamer.
- [ ] Tasa global de éxito se reporta **sin y con fallback**, separadas.
- [ ] No se invoca `nerdamer` para derivadas ni límites.

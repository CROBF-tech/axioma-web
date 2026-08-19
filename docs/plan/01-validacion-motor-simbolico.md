# Paso 01 — Validación del motor simbólico

> **Este paso va primero.** El spec declara como *riesgo técnico principal* que `@cortex-js/compute-engine` resuelva ejercicios típicos de Análisis Matemático I. Antes de construir UI, hay que validar que el motor entrega.

## Objetivo

Construir un script aislado (en `tools/`) que alimente un set de **15-20 ejercicios reales** (derivadas, límites, integrales) al `ComputeEngine` y verifique:
1. Resultado correcto (comparación simbólica o numérica).
2. Capacidad de mostrar *paso a paso* hasta donde llegó (cuando no resuelve completo).
3. Identificar qué casos requieren **fallback a Nerdamer** (sospecha: varias integrales).

## Por qué

Si el motor no resuelve el 80%+ del set, hay que reconsiderar el stack antes de invertir en UI. Esta validación es barata (un script Node) y desbloquea todo lo demás.

## Cómo

### 1. Instalar dependencias en `tools/`
```
@cortex-js/compute-engine
nerdamer (fallback a evaluar)
```
Ver `package.json` existente en la raíz (ya tiene `tools/`).

### 2. Set de ejercicios (mínimo 15)
Cubrir tres categorías:

**Derivadas (5)**
- `d/dx (x^2+1)/x`
- `d/dx sin(x^2)`
- `d/dx e^(2x)·cos(x)`
- `d/dx ln(x^3+1)`
- `d/dx x·sin(x)·ln(x)`

**Límites (5)**
- `lim x→0 sin(x)/x`
- `lim x→∞ (1 + 1/x)^x`
- `lim x→0 (e^x − 1)/x`
- `lim x→∞ x·ln(1 + 1/x)`
- `lim x→0 (1 − cos(x))/x^2`

**Integrales (5–8)**
- `∫ x·cos(x) dx` (por partes)
- `∫ 1/(x^2+1) dx` (arctan)
- `∫ x·e^x dx`
- `∫ ln(x) dx`
- `∫ 1/(x^2−1) dx` (parciales)
- `∫ sin^2(x) dx`
- `∫ e^x·sin(x) dx`
- `∫ x^2·e^(−x) dx` (sospechoso de fallback)

### 3. Estrategia de comparación
- **Simbólica:** simplificar `resultado − esperado` con el propio `ComputeEngine`; si canonicaliza a `0`, ✓.
- **Numérica (fallback de verificación):** evaluar ambos en 5 valores aleatorios del dominio y comparar con tolerancia `1e-6`.

### 4. Paso a paso
El `ComputeEngine` expresa `expr.steps` o un árbol de evaluación parcial (ver docs Context7). Capturar:
- Reglas aplicadas.
- Subexpresión donde se detuvo.
- Mensaje humano: *"No pude resolver por completo; llegué hasta: <expr>"*.

### 5. Decisiones de fallback
- Si `ComputeEngine` falla en ≥2 integrales → integrar `nerdamer` como segundo intento **solo para integrales**.
- Documentar en `tools/RESULTADOS.md` qué casos pasan, cuáles no, y la estrategia final recomendada.

## Entregables

- `tools/validate-engine.ts` — script ejecutable.
- `tools/exercises.ts` — set de ejercicios + esperados.
- `tools/RESULTADOS.md` — reporte: tasa de éxito por categoría, casos que requieren fallback, recomendación final.
- Decisión documentada: ¿`compute-engine` solo, o `compute-engine + nerdamer`?

## Criterios de aceptación

- [ ] Set de ≥15 ejercicios cubriendo derivadas, límites e integrales.
- [ ] ≥80% de éxito global sin fallback.
- [ ] Para cada fallo, output de "paso a paso hasta donde llegó" (no error crudo).
- [ ] Reporte `RESULTADOS.md` con decisión de fallback firmada.
- [ ] Script reutilizable para regresión futura.

## Skills / docs usadas

- Context7 `/cortex-js/compute-engine`: `D()`, `Integrate()`, `loadIntegrationRules`, ejemplos de derivadas e integrales simbólicas.
- No requiere skill instalada; es código de validación puro.
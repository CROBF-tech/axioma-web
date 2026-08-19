# Axioma Web — Spec v1

## Qué es

Alternativa liviana y accesible a Wolfram Mathematica, pensada para estudiantes universitarios y usuarios comunes que necesitan cálculo simbólico y gráficos, sin pagar precios de software profesional. Producto bajo CROBF.

## Identidad visual

- Minimalista, alto contraste
- Fondo blanco/negro
- Color de acento configurable por el usuario

## Modelo de negocio

- Sin capa gratuita — pago desde el día 1
- Suscripción mensual, con opción anual con descuento (~u$s2/mes de referencia)
- Procesador de pagos: **Mercado Pago**

## Stack

**Frontend**
- React (sin plantillas/boilerplate, armado desde cero)
- zustand — estado del notebook
- mathlive — input matemático estilo LaTeX
- katex — renderizado de fórmulas
- @cortex-js/compute-engine — motor simbólico (derivadas, simplificación, evaluación; fallback a Nerdamer para integrales si hace falta)
- function-plot — gráficos 2D
- dexie — caché/offline local (no es fuente de verdad; sincroniza con backend)

**Backend**
- Hono, construido desde cero
- better-auth — autenticación
- Turso (libSQL) — base de datos
- Mercado Pago — cobros de suscripción (mensual/anual)

## Funcionalidades

### Cálculo simbólico
- Derivadas
- Límites
- Integrales
- Si el motor no puede resolver algo simbólicamente por completo: mostrar el paso a paso hasta donde llegó (nunca un error genérico sin contexto)

### Gráficos
- Gráficos 2D de funciones (zoom, pan, múltiples funciones superpuestas)

### Notebook
- Interfaz de celdas (estilo Jupyter/Mathematica)
- Múltiples celdas encadenadas, reordenables, eliminables
- Referencia a resultados de celdas anteriores dentro del mismo notebook

### Organización
- Notebooks organizados en carpetas/categorías
- Opción de compartir un notebook públicamente (link de solo lectura)

### Cuentas y datos
- Registro/login con **email y contraseña** (vía better-auth, sin login social ni otros métodos por ahora)
- Notebooks y datos del usuario persistidos en el backend (Turso), con caché local (dexie) para uso offline/rápido
- Sincronización entre dispositivos

### Suscripción
- Sin trial gratis — acceso completo requiere suscripción activa
- Plan mensual
- Plan anual con descuento
- Cobros procesados vía Mercado Pago

## Riesgo técnico principal

El motor simbólico (@cortex-js/compute-engine + posible fallback) tiene que poder resolver de forma confiable ejercicios típicos de un curso de Análisis Matemático I (derivadas, límites, integrales). Se recomienda validar esto con un set de 15-20 ejercicios reales antes de avanzar de lleno con el desarrollo de la UI del notebook.

# Inconsistencias detectadas entre `producto.md` y `plan/`

> Generado durante la revisión cruzada. **No son bloqueantes** para dividir en tasks, pero hay que resolverlas antes de implementar.

## Tipográficas (corregidas)

| Archivo | Línea | Antes | Después |
|---------|-------|-------|---------|
| `plan/01-validacion-motor-simbolico.md` | 57 | "exprega" | "expresa" |
| `plan/06-autenticacion-better-auth.md` | 73 | "No hay**泄漏**" | "No hay fuga" |
| `plan/12-pulido-sharing-accesibilidad.md` | 18 | "(link permanente hasta desactivar." | "(link permanente hasta desactivar)." |

## Decisiones faltantes (a resolver antes de implementar)

### D1. Verificación de email en registro
- **Spec:** no exige verificación; solo dice "email y contraseña".
- **Plan (paso 06):** propone `requireEmailVerification: false` en MVP.
- **Riesgo:** sin verificación, cualquiera puede registrar emails ajenos.
- **Recomendación:** dejar `false` para MVP, documentar el riesgo en `apps/api/src/auth/README.md` y crear una task explícita de "evaluar activación de verificación antes de prod".

### D2. Endpoints del backend definidos tarde
- **Paso 08 línea 35** menciona `POST /notebooks/:id/cells` y `PATCH/DELETE` como si estuvieran listos.
- Esos endpoints **no** se definieron en los pasos 04-07.
- **Recomendación:** agregar una task explícita "definir contrato REST de notebooks/cells" al inicio del paso 08 o crear un paso 05b.

### D3. Referencia anticipada a `GET /public/notebooks/:slug`
- **Paso 06 línea 47** lista esa ruta como "pública" del middleware de auth, antes de que exista.
- Se implementa recién en el **paso 12**.
- **Recomendación:** aclarar en el paso 06 que el listado de rutas públicas es una proyección; el endpoint concreto se materializa en el paso 12.

### D4. Orden de monorepo vs validación
- El plan asume **paso 01 antes del paso 02** (validación del motor como primer paso).
- Pero `tools/validate-engine.ts` depende de TypeScript y de un `package.json` en `tools/`.
- **Recomendación:** definir el paso 02 (mínimo `tools/package.json` y `tsconfig`) ANTES del paso 01, o convertir el paso 01 en un script Node plano sin TS. **Orden ajustado sugerido:** `02 → 01 → 03 → ...`.

### D5. `bun --filter` no es nativo de Bun
- Pasos 02, 04 usan `bun --filter @axioma/web dev` (sintaxis pnpm).
- Bun sí soporta `--filter` desde v0.6, pero el patrón de workspaces usa `apps/*` en `package.json` raíz + `bun --filter <name> <script>`.
- **Recomendación:** verificar la versión de bun y, si es <0.6, usar `bun --cwd apps/web run dev`.

### D6. Persistencia del notebook en paso 08 sin contrato
- Mismo problema que D2: paso 08 implementa persistencia con backend, pero el endpoint no fue definido.
- **Recomendación:** agregar task "Definir y documentar contrato `Notebook`/`Cell` API" al inicio del paso 08.

### D7. `requireSubscription` afecta lectura pública
- Paso 11 línea 39-40 dice "bloquea POST/PATCH/DELETE" pero el endpoint público GET **no** debe bloquearse.
- Confirmar que la regla de gating es solo para mutaciones (lecturas públicas no requieren sub).
- **Recomendación:** agregar task explícita "documentar matriz de permisos por endpoint".

### D8. Compartir notebook público + suscripción
- Paso 12 dice "Sharing público (solo lectura)".
- Si no hay verificación de email y cualquiera puede ver, ¿se comparte bajo slug sin restricción? OK.
- **Recomendación:** aclarar que el `public_slug` debe ser no-enumerable (>= 22 caracteres, base62).

## Coherencia general con el spec

- Stack confirmado coincide con el spec.
- Sin trial gratis, suscripción obligatoria — coincide.
- Notebooks con celdas reordenables, referencias entre celdas — coincide.
- Caché local (Dexie) + sync backend — coincide.
- Solo email/password, sin social login — coincide.
- Mercado Pago como PSP — coincide.
- Riesgo técnico principal (motor simbólico) abordado primero — coincide.
- No se menciona la **categoría de usuario**: estudiantes universitarios + usuarios comunes. El plan no segmenta features; OK porque el producto es uno solo.
- Spec dice "Alternativa liviana y accesible". El plan no menciona explícitamente métricas de accesibilidad (WCAG, Lighthouse a11y). El paso 12 lo cubre parcialmente.
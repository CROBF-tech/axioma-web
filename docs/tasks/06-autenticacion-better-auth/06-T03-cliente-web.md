# Task 06-T03 — Cliente web con `createAuthClient` + hooks

- **Paso:** 06 — Autenticación better-auth
- **Tiempo estimado:** 1 hora
- **Depende de:** 06-T02

## Contexto

Plan paso 06 líneas 37-41.

## Alcance

- `apps/web/src/auth/client.ts`:
  ```ts
  import { createAuthClient } from 'better-auth/client';
  export const authClient = createAuthClient({ baseURL: import.meta.env.VITE_API_URL });
  export const { useSession, signIn, signUp, signOut } = authClient;
  ```
- Helper `getSession()` no-hook para llamadas no-React.

## Entregable

- Cliente + hooks exportados.

## Criterios de aceptación

- [ ] `useSession()` retorna `{ data, isPending }` coherente.
- [ ] `signIn.email({ email, password })` retorna `{ data, error }`.
- [ ] Cookies se almacenan en el navegador.
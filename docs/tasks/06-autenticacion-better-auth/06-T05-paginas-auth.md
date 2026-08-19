# Task 06-T05 — Páginas `/login` y `/register`

- **Paso:** 06 — Autenticación better-auth
- **Tiempo estimado:** 3 horas
- **Depende de:** 06-T03, 03-T04

## Contexto

Plan paso 06 línea 65.

## Alcance

- Componentes `<LoginForm />` y `<RegisterForm />` con shadcn Input + Button.
- Usan `authClient.signIn.email()` / `authClient.signUp.email()`.
- Mostrar errores como mensaje suave (no fugar si el email existe o no).
- Redirige a `/` o `/library` al éxito.
- Rutas: `/login`, `/register`.

## Entregable

- `apps/web/src/features/auth/{Login,Register}.tsx`.
- Routes en router cliente (a definir; use `react-router` o solución mínima).

## Criterios de aceptación

- [ ] Registro exitoso crea user y loguea automáticamente.
- [ ] Login con cred correctas redirige a `/library`.
- [ ] Mensajes de error genéricos: "Credenciales inválidas" sin distinguir email vs password.
- [ ] Link "¿No tienes cuenta? Regístrate" navega correctamente.
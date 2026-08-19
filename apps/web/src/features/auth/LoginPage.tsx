import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Card, Input } from "../../components/ui/index.ts"
import { signInWithEmail } from "../../auth/client.ts"
import "./auth.css"

const AUTH_ERROR_MESSAGE = "Credenciales inválidas"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await signInWithEmail(email, password)
      if (result.error !== null) {
        setError(AUTH_ERROR_MESSAGE)
        return
      }
      navigate("/library")
    } catch {
      setError(AUTH_ERROR_MESSAGE)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth">
      <Card className="auth__card">
        <header>
          <h1 className="auth__title">Iniciar sesión</h1>
          <p className="auth__subtitle">Accedé a tu cuenta de Axioma</p>
        </header>

        {error !== null && (
          <div className="auth__error" role="alert">
            {error}
          </div>
        )}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label" htmlFor="login-email">
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="login-password">
              Contraseña
            </label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="auth__submit"
            disabled={loading}
          >
            {loading ? "Ingresando…" : "Ingresar"}
          </Button>
        </form>

        <p className="auth__footer">
          ¿No tenés cuenta?{" "}
          <Link className="auth__link" to="/register">
            Registrate
          </Link>
        </p>
      </Card>
    </main>
  )
}
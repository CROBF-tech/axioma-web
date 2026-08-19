import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Card, Input } from "../../components/ui/index.ts"
import { signUpWithEmail } from "../../auth/client.ts"
import "./auth.css"

const AUTH_ERROR_MESSAGE = "Credenciales inválidas"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await signUpWithEmail(email, password, name)
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
          <h1 className="auth__title">Crear cuenta</h1>
          <p className="auth__subtitle">Empezá a usar Axioma hoy</p>
        </header>

        {error !== null && (
          <div className="auth__error" role="alert">
            {error}
          </div>
        )}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label" htmlFor="register-name">
              Nombre
            </label>
            <Input
              id="register-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="register-email">
              Email
            </label>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="register-password">
              Contraseña
            </label>
            <Input
              id="register-password"
              type="password"
              autoComplete="new-password"
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
            {loading ? "Creando…" : "Crear cuenta"}
          </Button>
        </form>

        <p className="auth__footer">
          ¿Ya tenés cuenta?{" "}
          <Link className="auth__link" to="/login">
            Iniciá sesión
          </Link>
        </p>
      </Card>
    </main>
  )
}
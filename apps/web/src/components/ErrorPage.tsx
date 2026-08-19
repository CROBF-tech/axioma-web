import { Button } from "./ui/index.ts"
import "./ErrorPage.css"

export default function ErrorPage() {
  return (
    <main className="error-page">
      <h1 className="error-page__title">Algo salió mal</h1>
      <p className="error-page__message">Ocurrió un error inesperado. Por favor, recarga la página.</p>
      <Button variant="primary" size="md" onClick={() => window.location.reload()}>
        Recargar
      </Button>
    </main>
  )
}

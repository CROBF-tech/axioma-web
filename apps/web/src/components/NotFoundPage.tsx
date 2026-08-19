import { Link } from "react-router-dom"
import "./NotFoundPage.css"

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__message">Página no encontrada.</p>
      <Link to="/" className="not-found__link">Volver al inicio</Link>
    </main>
  )
}

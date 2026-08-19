import { createBrowserRouter, useParams } from "react-router-dom"
import LoginPage from "./features/auth/LoginPage.tsx"
import RegisterPage from "./features/auth/RegisterPage.tsx"
import DesignPage from "./features/design/DesignPage.tsx"
import PricingPage from "./features/billing/PricingPage.tsx"
import RequireActiveSub from "./features/billing/RequireActiveSub.tsx"
import NotebookView from "./features/notebook/NotebookView.tsx"
import { getPublicNotebook } from "@axioma/db"
import { useEffect, useState } from "react"

function Home() {
  return (
    <main>
      <h1>Axioma</h1>
      <p>Sistema de notebooks computables.</p>
    </main>
  )
}

function Library() {
  return (
    <main className="library">
      <h1>Biblioteca</h1>
      <p>Próximamente: árbol de carpetas y notebooks.</p>
    </main>
  )
}

function NotebookRoute() {
  const { id } = useParams()
  if (!id) return <div className="notebook-view__empty">ID no válido</div>
  return (
    <RequireActiveSub>
      <NotebookView notebookId={id} />
    </RequireActiveSub>
  )
}

function PublicNotebookRoute() {
  const { slug } = useParams()
  const [data, setData] = useState<{ title: string; cells: unknown[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    getPublicNotebook(slug)
      .then((res) => setData({ title: res.notebook.title, cells: res.cells }))
      .catch(() => setError("No se pudo cargar el notebook público."))
  }, [slug])

  if (error) return <div className="notebook-view__error">{error}</div>
  if (!data) return <div className="notebook-view__empty">Cargando...</div>

  return (
    <div className="notebook-view">
      <header className="notebook-view__header">
        <h1 className="notebook-view__title">{data.title}</h1>
      </header>
      <p className="notebook-view__empty">Vista de solo lectura ({data.cells.length} celdas)</p>
    </div>
  )
}

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/pricing", element: <PricingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/design", element: <DesignPage /> },
  { path: "/library", element: <RequireActiveSub><Library /></RequireActiveSub> },
  { path: "/notebooks/:id", element: <NotebookRoute /> },
  { path: "/s/:slug", element: <PublicNotebookRoute /> },
])
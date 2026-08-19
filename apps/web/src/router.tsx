import { createBrowserRouter, Outlet, useParams } from "react-router-dom"
import LoginPage from "./features/auth/LoginPage.tsx"
import RegisterPage from "./features/auth/RegisterPage.tsx"
import DesignPage from "./features/design/DesignPage.tsx"
import PricingPage from "./features/billing/PricingPage.tsx"
import RequireActiveSub from "./features/billing/RequireActiveSub.tsx"
import NotebookView from "./features/notebook/NotebookView.tsx"
import LibraryPage from "./features/library/LibraryPage.tsx"
import { Header } from "./components/Header.tsx"
import NotFoundPage from "./components/NotFoundPage.tsx"
import ErrorPage from "./components/ErrorPage.tsx"
import { getPublicNotebook } from "@axioma/db"
import { useEffect, useState } from "react"

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

function Home() {
  return (
    <main>
      <h1>Axioma</h1>
      <p>Sistema de notebooks computables.</p>
    </main>
  )
}

function LayoutWithHeader() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <LayoutWithHeader />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/pricing", element: <PricingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/design", element: <DesignPage /> },
      { path: "/library", element: <RequireActiveSub><LibraryPage /></RequireActiveSub> },
      { path: "/notebooks/:id", element: <NotebookRoute /> },
      { path: "/error", element: <ErrorPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  { path: "/s/:slug", element: <PublicNotebookRoute /> },
])
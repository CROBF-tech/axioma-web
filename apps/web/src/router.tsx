import { createBrowserRouter, useParams } from "react-router-dom"
import LoginPage from "./features/auth/LoginPage.tsx"
import RegisterPage from "./features/auth/RegisterPage.tsx"
import DesignPage from "./features/design/DesignPage.tsx"
import PricingPage from "./features/billing/PricingPage.tsx"
import RequireActiveSub from "./features/billing/RequireActiveSub.tsx"
import NotebookView from "./features/notebook/NotebookView.tsx"
import LibraryPage from "./features/library/LibraryPage.tsx"
import PublicNotebookView from "./features/notebook/PublicNotebookView.tsx"
import { Layout } from "./components/Layout.tsx"
import NotFoundPage from "./components/NotFoundPage.tsx"
import ErrorPage from "./components/ErrorPage.tsx"

function NotebookRoute() {
  const { id } = useParams()
  if (!id) return <div className="notebook-view__empty">ID no válido</div>
  return (
    <RequireActiveSub>
      <NotebookView notebookId={id} />
    </RequireActiveSub>
  )
}

function Home() {
  return (
    <div className="home">
      <h1 className="home__title">Axioma</h1>
      <p className="home__subtitle">Sistema de notebooks computables.</p>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
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
  { path: "/s/:slug", element: <PublicNotebookView /> },
])
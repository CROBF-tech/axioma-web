import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPublicNotebook } from "@axioma/db"
import { useNotebookStore } from "../../store/notebook.ts"
import type { Cell, Notebook } from "@axioma/db"
import NotebookView from "./NotebookView.tsx"
import NotebookSkeleton from "./NotebookSkeleton.tsx"
import { EmptyState } from "../../components/ui/EmptyState.tsx"

export default function PublicNotebookView() {
  const { slug } = useParams()
  const notebook = useNotebookStore((s) => s.notebook)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      setError("Enlace inválido")
      return
    }
    setLoading(true)
    setError(null)
    getPublicNotebook(slug)
      .then((res) => {
        const runtimes: Record<string, { running: boolean; error: string | null; result: null }> = {}
        for (const c of res.cells) runtimes[c.id] = { running: false, error: null, result: null }
        useNotebookStore.setState({
          notebook: res.notebook as Notebook,
          cells: res.cells as Cell[],
          runtimes,
          loading: false,
          error: null,
          activeCellId: null,
        })
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setError("No se pudo cargar el notebook público.")
      })
  }, [slug])

  if (loading) return <NotebookSkeleton />
  if (error) return <EmptyState icon="⚠️" title="Error" message={error} />
  if (!notebook) return <EmptyState icon="🔭" title="No encontrado" message="El notebook no existe o dejó de ser público." />

  return <NotebookView notebookId={notebook.id} readOnly={true} />
}

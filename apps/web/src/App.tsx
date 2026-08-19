import { useEffect, useState } from 'react'
import {
  getNotebook,
  listNotebooks,
  updateCell,
  createNotebook,
  type Notebook,
  type Cell,
} from '@axioma/db'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null)
  const [updatedCell, setUpdatedCell] = useState<Cell | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      setLoading(true)
      setError(null)

      try {
        const list = await listNotebooks()
        if (cancelled) return
        setNotebooks(list)

        if (list.length > 0) {
          const first = list[0]!
          const notebook = await getNotebook(first.id)
          if (cancelled) return
          setSelectedNotebook(notebook)

          if (notebook.id) {
            const cell = await updateCell('demo-cell-id', { input: 'x + 1' })
            if (cancelled) return
            setUpdatedCell(cell)
          }
        } else {
          const created = await createNotebook({
            ownerId: 'demo-owner',
            title: 'Demo notebook',
            isPublic: false,
          })
          if (cancelled) return
          setNotebooks((prev) => [...prev, created])
          setSelectedNotebook(created)
        }
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="app">
      <h1>Hello Axioma</h1>
      <p>Frontend Vite + React listo.</p>

      <section aria-label="@axioma/db demo">
        <h2>DB Demo</h2>
        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
        {!loading && !error && (
          <>
            <p>Notebooks: {notebooks.length}</p>
            {selectedNotebook && <p>Seleccionado: {selectedNotebook.title}</p>}
            {updatedCell && <p>Celda actualizada: {updatedCell.input}</p>}
          </>
        )}
      </section>

      <button
        type="button"
        className="counter"
        onClick={() => setCount((c) => c + 1)}
      >
        Count is {count}
      </button>
    </main>
  )
}

export default App

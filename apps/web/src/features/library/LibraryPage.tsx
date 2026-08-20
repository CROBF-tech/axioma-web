import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Folder, Notebook } from "@axioma/db"
import { useSession } from "../../auth/client.ts"
import { Button } from "../../components/ui/index.ts"
import {
  createFolder,
  createNotebook,
  listFolders,
  listNotebooks,
} from "../../data/repository.ts"
import FolderTree from "./FolderTree.tsx"
import NotebookItem from "./NotebookItem.tsx"
import LibrarySkeleton from "./LibrarySkeleton.tsx"
import { EmptyState } from "../../components/ui/index.ts"
import "./LibraryPage.css"

export default function LibraryPage() {
  const navigate = useNavigate()
  const { data: session } = useSession()
  const [folders, setFolders] = useState<Folder[]>([])
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState<string | null>(null)

  async function loadData() {
    setIsLoading(true)
    setError(null)
    try {
      const [foldersRes, notebooksRes] = await Promise.all([
        listFolders(),
        listNotebooks(),
      ])
      setFolders(foldersRes.items)
      setNotebooks(notebooksRes.items)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Ocurrió un error inesperado"
      setError(`No se pudo cargar la biblioteca: ${message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [session?.user?.id])

  const currentNotebooks = useMemo(() => {
    return notebooks.filter((n) => (n.folderId ?? null) === currentFolderId)
  }, [notebooks, currentFolderId])

  function handleCreateNotebook() {
    void createNotebook({ title: "Sin título", folderId: currentFolderId })
      .then((notebook) => {
        navigate(`/notebooks/${notebook.id}`)
      })
  }

  function handleCreateRootFolder(name: string) {
    if (name.trim().length === 0) {
      setNewFolderName(null)
      return
    }
    void createFolder({ name: name.trim(), parentId: null })
      .then(() => {
        setNewFolderName(null)
        return loadData()
      })
  }

  if (isLoading) {
    return <LibrarySkeleton />
  }

  if (error) {
    return (
      <div className="library-page">
        <main className="library-page__main">
          <div className="library-page__error">{error}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="library-page">
      <aside className="library-page__sidebar" role="complementary" aria-label="Navegación de biblioteca">
        <header className="library-page__sidebar-header">
          <h2 className="library-page__sidebar-title">Biblioteca</h2>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setNewFolderName("")}
            aria-label="Crear nueva carpeta"
          >
            + Carpeta
          </Button>
        </header>
        {newFolderName !== null && (
          <div className="library-page__new-folder">
            <input
              className="library-page__new-folder-input"
              value={newFolderName}
              placeholder="Nueva carpeta"
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={() => handleCreateRootFolder(newFolderName)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateRootFolder(newFolderName)
                if (e.key === "Escape") setNewFolderName(null)
              }}
              autoFocus
            />
          </div>
        )}
        <nav aria-label="Carpetas">
          <FolderTree
            folders={folders}
            selectedId={currentFolderId}
            onSelect={setCurrentFolderId}
            onChange={loadData}
          />
        </nav>
      </aside>
      <main className="library-page__main" role="main" id="main-content" tabIndex={-1}>
        <header className="library-page__main-header">
          <h1 className="library-page__title">
            {currentFolderId === null ? "Raíz" : folders.find((f) => f.id === currentFolderId)?.name ?? "Carpeta"}
          </h1>
          <Button size="sm" variant="primary" onClick={handleCreateNotebook} aria-label="Crear nuevo notebook">
            + Nuevo notebook
          </Button>
        </header>

        {currentNotebooks.length === 0 ? (
          <EmptyState
            icon="📝"
            title="Sin notebooks todavía"
            message="Creá el primero para empezar a trabajar."
            actionLabel="Crear primer notebook"
            onAction={handleCreateNotebook}
          />
        ) : (
          <ul className="library-page__notebook-list">
            {currentNotebooks.map((notebook) => (
              <li key={notebook.id} className="library-page__notebook-item">
                <NotebookItem
                  notebook={notebook}
                  folders={folders}
                  onChange={loadData}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

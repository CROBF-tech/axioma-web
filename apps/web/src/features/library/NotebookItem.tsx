import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Folder, Notebook } from "@axioma/db"
import { Button, Card } from "../../components/ui/index.ts"
import { updateNotebookMeta } from "../../data/repository.ts"
import "./NotebookItem.css"

type NotebookItemProps = {
  notebook: Notebook
  folders: Folder[]
  onChange: () => void
}

export default function NotebookItem({ notebook, folders, onChange }: NotebookItemProps) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showMove, setShowMove] = useState(false)

  function handleMove(folderId: string | null) {
    void updateNotebookMeta(notebook.id, { folderId })
      .then(() => {
        setShowMove(false)
        setShowMenu(false)
        onChange()
      })
  }

  function handleCardClick() {
    if (showMenu || showMove) return
    navigate(`/notebooks/${notebook.id}`)
  }

  return (
    <Card className="notebook-item">
      <div className="notebook-item__main" onClick={handleCardClick}>
        <h3 className="notebook-item__title">{notebook.title}</h3>
        <p className="notebook-item__date">
          {new Date(notebook.updatedAt).toLocaleDateString()}
        </p>
      </div>
      <div className="notebook-item__actions">
        <Button
          variant="ghost"
          size="sm"
          className="notebook-item__menu-btn"
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu(!showMenu)
            setShowMove(false)
          }}
        >
          ⋮
        </Button>
        {showMenu && (
          <div className="notebook-item__menu">
            <button
              className="notebook-item__menu-item"
              onClick={(e) => {
                e.stopPropagation()
                setShowMove(true)
                setShowMenu(false)
              }}
            >
              Mover a…
            </button>
          </div>
        )}
        {showMove && (
          <div className="notebook-item__move">
            <select
              value={notebook.folderId ?? ""}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handleMove(e.target.value || null)}
              autoFocus
            >
              <option value="">Raíz</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setShowMove(false)
              }}
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

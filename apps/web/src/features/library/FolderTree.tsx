import { useMemo, useState } from "react"
import type { Folder } from "@axioma/db"
import { Button, Input } from "../../components/ui/index.ts"
import {
  createFolder,
  deleteFolder,
  updateFolder,
} from "../../data/repository.ts"
import "./FolderTree.css"

type FolderNode = {
  folder: Folder
  children: FolderNode[]
}

type FolderTreeProps = {
  folders: Folder[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onChange: () => void
}

type FolderTreeItemProps = {
  node: FolderNode
  depth: number
  folders: Folder[]
  selectedId: string | null
  expanded: Set<string>
  onToggleExpand: (id: string) => void
  onSelect: (id: string | null) => void
  onChange: () => void
}

function buildTree(folders: Folder[]): FolderNode[] {
  const byParent = new Map<string | null, Folder[]>()
  for (const folder of folders) {
    const key = folder.parentId ?? null
    const list = byParent.get(key) ?? []
    list.push(folder)
    byParent.set(key, list)
  }

  function build(parentId: string | null): FolderNode[] {
    const children = byParent.get(parentId) ?? []
    return children
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((folder) => ({
        folder,
        children: build(folder.id),
      }))
  }

  return build(null)
}

function isDescendantOf(folders: Folder[], descendantId: string, ancestorId: string): boolean {
  const byId = new Map(folders.map((f) => [f.id, f]))
  let current = byId.get(descendantId)
  while (current) {
    if (current.parentId === ancestorId) return true
    current = current.parentId ? byId.get(current.parentId) : undefined
  }
  return false
}

function FolderTreeItem({
  node,
  depth,
  folders,
  selectedId,
  expanded,
  onToggleExpand,
  onSelect,
  onChange,
}: FolderTreeItemProps) {
  const { folder, children } = node
  const isSelected = selectedId === folder.id
  const isExpanded = expanded.has(folder.id)
  const [mode, setMode] = useState<"idle" | "rename" | "newSubfolder" | "move">("idle")
  const [editName, setEditName] = useState(folder.name)
  const [subName, setSubName] = useState("")

  function saveRename() {
    const name = editName.trim()
    if (name.length > 0 && name !== folder.name) {
      void updateFolder(folder.id, { name }).then(onChange)
    } else {
      setEditName(folder.name)
    }
    setMode("idle")
  }

  function createSubfolder() {
    const name = subName.trim()
    if (name.length === 0) {
      setMode("idle")
      return
    }
    void createFolder({ name, parentId: folder.id }).then(() => {
      setSubName("")
      setMode("idle")
      onToggleExpand(folder.id)
      onChange()
    })
  }

  function handleDelete() {
    if (!window.confirm(`¿Eliminar la carpeta "${folder.name}"? Los notebooks se moverán a Raíz.`)) return
    void deleteFolder(folder.id).then(onChange)
  }

  function handleMoveParent(parentId: string | null) {
    if (parentId === folder.parentId) {
      setMode("idle")
      return
    }
    void updateFolder(folder.id, { parentId }).then(() => {
      setMode("idle")
      onChange()
    })
  }

  const moveCandidates = useMemo(() => {
    return folders.filter((f) => f.id !== folder.id && !isDescendantOf(folders, f.id, folder.id))
  }, [folders, folder])

  return (
    <li className="folder-tree__item">
      <div
        className={["folder-tree__row", isSelected && "folder-tree__row--selected"].filter(Boolean).join(" ")}
        style={{ paddingLeft: `${depth * 1.25 + 0.75}rem` }}
      >
        {children.length > 0 && (
          <button
            className="folder-tree__expand"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand(folder.id)
            }}
          >
            {isExpanded ? "▾" : "▸"}
          </button>
        )}
        {children.length === 0 && <span className="folder-tree__expand folder-tree__expand--placeholder" />}

        {mode === "rename" ? (
          <Input
            className="folder-tree__rename-input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={saveRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveRename()
              if (e.key === "Escape") {
                setEditName(folder.name)
                setMode("idle")
              }
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className="folder-tree__label"
            onClick={() => onSelect(folder.id)}
          >
            {folder.name}
          </span>
        )}

        {mode !== "rename" && (
          <div className="folder-tree__actions">
            <Button
              variant="ghost"
              size="sm"
              className="folder-tree__action-btn"
              onClick={(e) => {
                e.stopPropagation()
                setMode("newSubfolder")
              }}
            >
              +
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="folder-tree__action-btn"
              onClick={(e) => {
                e.stopPropagation()
                setMode("rename")
              }}
            >
              ✎
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="folder-tree__action-btn"
              onClick={(e) => {
                e.stopPropagation()
                setMode("move")
              }}
            >
              ➜
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="folder-tree__action-btn folder-tree__action-btn--danger"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
            >
              ×
            </Button>
          </div>
        )}
      </div>

      {mode === "newSubfolder" && (
        <div
          className="folder-tree__new-subfolder"
          style={{ paddingLeft: `${(depth + 1) * 1.25 + 0.75}rem` }}
        >
          <Input
            className="folder-tree__rename-input"
            value={subName}
            placeholder="Nueva subcarpeta"
            onChange={(e) => setSubName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") createSubfolder()
              if (e.key === "Escape") {
                setSubName("")
                setMode("idle")
              }
            }}
            autoFocus
          />
        </div>
      )}

      {mode === "move" && (
        <div
          className="folder-tree__move"
          style={{ paddingLeft: `${(depth + 1) * 1.25 + 0.75}rem` }}
        >
          <select
            value={folder.parentId ?? ""}
            onChange={(e) => handleMoveParent(e.target.value || null)}
            autoFocus
          >
            <option value="">Raíz</option>
            {moveCandidates.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMode("idle")}
          >
            Cancelar
          </Button>
        </div>
      )}

      {children.length > 0 && isExpanded && (
        <ul className="folder-tree__list">
          {children.map((child) => (
            <FolderTreeItem
              key={child.folder.id}
              node={child}
              depth={depth + 1}
              folders={folders}
              selectedId={selectedId}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              onChange={onChange}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function FolderTree({
  folders,
  selectedId,
  onSelect,
  onChange,
}: FolderTreeProps) {
  const tree = useMemo(() => buildTree(folders), [folders])
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <nav className="folder-tree">
      <ul className="folder-tree__list">
        <li className="folder-tree__item">
          <div
            className={["folder-tree__row", selectedId === null && "folder-tree__row--selected"].filter(Boolean).join(" ")}
            onClick={() => onSelect(null)}
          >
            <span className="folder-tree__expand folder-tree__expand--placeholder" />
            <span className="folder-tree__label">Raíz</span>
          </div>
        </li>
        {tree.map((node) => (
          <FolderTreeItem
            key={node.folder.id}
            node={node}
            depth={0}
            folders={folders}
            selectedId={selectedId}
            expanded={expanded}
            onToggleExpand={toggleExpand}
            onSelect={onSelect}
            onChange={onChange}
          />
        ))}
      </ul>
    </nav>
  )
}

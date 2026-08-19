import type { Cell } from "@axioma/db"
import { useEffect, useRef } from "react"
import "./RefAutocomplete.css"

export type RefAutocompleteProps = {
  cells: Cell[]
  query: string
  onSelect: (id: string) => void
  onClose: () => void
}

export default function RefAutocomplete({ cells, query, onSelect, onClose }: RefAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape") onClose()
      },
      { signal: controller.signal },
    )
    return () => controller.abort()
  }, [onClose])

  useEffect(() => {
    if (!listRef.current) return
    const firstItem = listRef.current.querySelector("li")
    if (firstItem instanceof HTMLElement) firstItem.focus()
  }, [])

  const needle = query.slice(2).toLowerCase()
  const filtered = cells.filter((c) => c.input.toLowerCase().includes(needle) || c.id.toLowerCase().includes(needle))

  function handleSelect(id: string) {
    onSelect(id)
    onClose()
  }

  return (
    <div ref={containerRef} className="ref-autocomplete" role="listbox" aria-label="Referencias disponibles">
      {filtered.length === 0 && (
        <div className="ref-autocomplete__empty">No hay celdas anteriores</div>
      )}
      <ul ref={listRef} className="ref-autocomplete__list">
        {filtered.map((c) => (
          <li key={c.id} className="ref-autocomplete__item" role="option" tabIndex={-1} onClick={() => handleSelect(c.id)}>
            <span className="ref-autocomplete__id">$${c.id}</span>
            <span className="ref-autocomplete__preview">{c.input.slice(0, 30)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

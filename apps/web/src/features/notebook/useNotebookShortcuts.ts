import { useEffect } from "react"
import { useNotebookStore } from "../../store/notebook.ts"

export function useNotebookShortcuts() {
  const activeCellId = useNotebookStore((s) => s.activeCellId)

  useEffect(() => {
    function focusCellByOffset(offset: number) {
      if (!activeCellId) return
      const nodes = Array.from(document.querySelectorAll("[data-cell-id]"))
      const index = nodes.findIndex((node) => node.getAttribute("data-cell-id") === activeCellId)
      if (index === -1) return
      const target = nodes[index + offset]
      if (target instanceof HTMLElement) {
        target.focus()
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target
      if (target instanceof HTMLElement && target.tagName.toLowerCase() === "math-field") {
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault()
        if (activeCellId) {
          void useNotebookStore.getState().runCell(activeCellId)
        }
        return
      }

      if (e.key === "ArrowDown") {
        e.preventDefault()
        focusCellByOffset(1)
        return
      }

      if (e.key === "ArrowUp") {
        e.preventDefault()
        focusCellByOffset(-1)
        return
      }

      if (e.key === "Escape") {
        if (target instanceof HTMLElement && target.blur) {
          target.blur()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeCellId])
}

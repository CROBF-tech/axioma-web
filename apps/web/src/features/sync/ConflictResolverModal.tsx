import { useEffect, useRef } from "react"
import type { SyncQueueEntry } from "@axioma/shared"
import { ConflictResolver } from "./ConflictResolver.tsx"
import "./ConflictResolverModal.css"

export type ConflictResolverModalProps = {
  entry: SyncQueueEntry | null
  onClose: () => void
  onResolved?: () => void
}

export function ConflictResolverModal({ entry, onClose, onResolved }: ConflictResolverModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (entry) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [entry])

  function handleClose() {
    onClose()
  }

  function handleResolved() {
    onResolved?.()
    onClose()
  }

  if (!entry) return null

  return (
    <dialog ref={dialogRef} className="conflict-resolver-modal" onClose={handleClose}>
      <div className="conflict-resolver-modal__overlay" onClick={handleClose}>
        <div className="conflict-resolver-modal__content" onClick={(e) => e.stopPropagation()}>
          <div className="conflict-resolver-modal__header">
            <h2 className="conflict-resolver-modal__title">Resolver conflicto</h2>
            <button type="button" className="conflict-resolver-modal__close" onClick={handleClose} aria-label="Cerrar">
              ×
            </button>
          </div>
          <ConflictResolver entry={entry} onResolved={handleResolved} />
        </div>
      </div>
    </dialog>
  )
}

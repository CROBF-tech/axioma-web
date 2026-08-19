import { useState } from "react"
import { Button } from "../../components/ui/index.ts"
import { toggleShare } from "@axioma/db"
import "./SharePanel.css"

export type SharePanelProps = {
  notebookId: string
  initialPublic: boolean
  initialSlug: string | null | undefined
}

export default function SharePanel({ notebookId, initialPublic, initialSlug }: SharePanelProps) {
  const [isPublic, setIsPublic] = useState(initialPublic)
  const [slug, setSlug] = useState<string | null>(initialSlug ?? null)
  const [copied, setCopied] = useState(false)

  const publicUrl = slug ? `${window.location.origin}/s/${slug}` : null

  function handleToggle() {
    const next = !isPublic
    void toggleShare(notebookId, next).then((res) => {
      setIsPublic(res.isPublic)
      setSlug(res.publicSlug)
    })
  }

  function handleCopy() {
    if (!publicUrl) return
    void navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="share-panel">
      <label className="share-panel__toggle">
        <input type="checkbox" checked={isPublic} onChange={handleToggle} />
        <span>Compartir públicamente</span>
      </label>
      {isPublic && publicUrl && (
        <div className="share-panel__link">
          <input className="share-panel__url" type="text" readOnly value={publicUrl} />
          <Button size="sm" variant="secondary" onClick={handleCopy}>
            {copied ? "Copiado" : "Copiar link"}
          </Button>
        </div>
      )}
    </div>
  )
}

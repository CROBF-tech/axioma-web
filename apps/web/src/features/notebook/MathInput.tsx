import { useEffect, useRef, useCallback } from "react"
import "mathlive"
import type { MathfieldElement } from "mathlive"
import "./MathInput.css"

export type MathInputProps = {
  value: string
  onChange: (latex: string) => void
  onRun?: () => void
  readOnly?: boolean
  placeholder?: string
}

export default function MathInput({ value, onChange, onRun, readOnly = false, placeholder = "Escribe una expresión matemática..." }: MathInputProps) {
  const ref = useRef<MathfieldElement>(null)
  const onChangeRef = useRef(onChange)
  const onRunRef = useRef(onRun)

  onChangeRef.current = onChange
  onRunRef.current = onRun

  useEffect(() => {
    const mf = ref.current
    if (!mf) return
    if (mf.value !== value) {
      const active = document.activeElement
      const hasFocus = active === mf || mf.contains(active)
      mf.value = value
      if (hasFocus) mf.focus()
    }
  }, [value])

  useEffect(() => {
    const mf = ref.current
    if (!mf) return

    const handleInput = (e: Event) => {
      const target = e.target as MathfieldElement
      onChangeRef.current(target.value)
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault()
        onRunRef.current?.()
      }
    }

    mf.addEventListener("input", handleInput)
    mf.addEventListener("keydown", handleKeydown)

    return () => {
      mf.removeEventListener("input", handleInput)
      mf.removeEventListener("keydown", handleKeydown)
    }
  }, [])

  const handleRef = useCallback((node: MathfieldElement | null) => {
    if (node) {
      node.value = value
      node.readOnly = readOnly
    }
    ref.current = node
  }, [value, readOnly])

  return (
    <math-field
      ref={handleRef}
      className="math-field"
      virtual-keyboard-mode="manual"
      placeholder={placeholder}
    />
  )
}

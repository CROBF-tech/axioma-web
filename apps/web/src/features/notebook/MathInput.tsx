import { useEffect, useRef, useCallback, useState } from "react"
import "mathlive"
import type { MathfieldElement } from "mathlive"
import type { Cell } from "@axioma/db"
import { matchRefStub } from "./refs.ts"
import RefAutocomplete from "./RefAutocomplete.tsx"
import "./MathInput.css"

export type MathInputProps = {
  value: string
  onChange: (latex: string) => void
  onRun?: () => void
  readOnly?: boolean
  placeholder?: string
  cells?: Cell[]
}

export default function MathInput({ value, onChange, onRun, readOnly = false, placeholder = "Escribe una expresión matemática...", cells = [] }: MathInputProps) {
  const ref = useRef<MathfieldElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const onChangeRef = useRef(onChange)
  const onRunRef = useRef(onRun)
  const [autocomplete, setAutocomplete] = useState<{ query: string; top: number; left: number } | null>(null)

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

  useEffect(() => {
    const stub = matchRefStub(value)
    if (!stub || readOnly) {
      setAutocomplete(null)
      return
    }
    const wrapper = wrapperRef.current
    const mf = ref.current
    if (!wrapper || !mf) return
    const rect = wrapper.getBoundingClientRect()
    setAutocomplete({
      query: stub,
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    })
  }, [value, readOnly])

  const handleRef = useCallback((node: MathfieldElement | null) => {
    if (node) {
      node.value = value
      node.readOnly = readOnly
    }
    ref.current = node
  }, [value, readOnly])

  function handleSelect(id: string) {
    const stub = autocomplete?.query
    if (!stub) return
    const replacement = value.slice(0, value.length - stub.length) + `$$${id}`
    onChange(replacement)
    setAutocomplete(null)
    ref.current?.focus()
  }

  return (
    <div ref={wrapperRef} className="math-input-wrapper">
      <math-field
        ref={handleRef}
        className="math-field"
        virtual-keyboard-mode="manual"
        placeholder={placeholder}
      />
      {autocomplete && (
        <div
          style={{
            position: "fixed",
            top: autocomplete.top,
            left: autocomplete.left,
          }}
        >
          <RefAutocomplete
            cells={cells}
            query={autocomplete.query}
            onSelect={handleSelect}
            onClose={() => setAutocomplete(null)}
          />
        </div>
      )}
    </div>
  )
}

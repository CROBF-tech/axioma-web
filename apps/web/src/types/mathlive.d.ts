import type { MathfieldElement } from "mathlive"
import type { DetailedHTMLProps, HTMLAttributes } from "react"

declare global {
  interface HTMLElementTagNameMap {
    "math-field": MathfieldElement
  }
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": DetailedHTMLProps<
        HTMLAttributes<MathfieldElement> & { placeholder?: string },
        MathfieldElement
      >
    }
  }
}

export {}

const LATEX_SPACES = /\\?\s+/g
const LATEX_COMMANDS: Record<string, string> = {
  "\\sin": "Math.sin",
  "\\cos": "Math.cos",
  "\\tan": "Math.tan",
  "\\sec": "Math.sec",
  "\\csc": "Math.csc",
  "\\cot": "Math.cot",
  "\\asin": "Math.asin",
  "\\acos": "Math.acos",
  "\\atan": "Math.atan",
  "\\log": "Math.log10",
  "\\ln": "Math.log",
  "\\sqrt": "Math.sqrt",
}

const PLAIN_COMMANDS: Record<string, string> = {
  sin: "Math.sin",
  cos: "Math.cos",
  tan: "Math.tan",
  sec: "Math.sec",
  csc: "Math.csc",
  cot: "Math.cot",
  asin: "Math.asin",
  acos: "Math.acos",
  atan: "Math.atan",
  log: "Math.log10",
  ln: "Math.log",
  sqrt: "Math.sqrt",
}

const FN_PREFIX = /^(?:[a-zA-Z][a-zA-Z0-9]*)?\s*\(\s*[a-zA-Z][a-zA-Z0-9]*\s*\)\s*=\s*/
const Y_PREFIX = /^y\s*=\s*/

export function latexToJsExpr(latex: string): string {
  if (!latex || !latex.trim()) return ""
  let expr = latex.replace(LATEX_SPACES, "")
  expr = replaceSqrt(expr)
  expr = replaceFrac(expr)
  expr = replacePowers(expr)
  expr = replaceLatexCommands(expr)
  expr = replacePlainCommands(expr)
  return expr
}

function replaceLatexCommands(expr: string): string {
  let result = expr
  for (const [cmd, replacement] of Object.entries(LATEX_COMMANDS)) {
    if (cmd === "\\sqrt" || cmd === "\\frac") continue
    result = result.replaceAll(cmd, replacement)
  }
  return result
}

function replacePlainCommands(expr: string): string {
  let result = expr
  for (const [cmd, replacement] of Object.entries(PLAIN_COMMANDS)) {
    const regex = new RegExp(`(?<!Math\\.)\\b${cmd}\\b`, "g")
    result = result.replace(regex, replacement)
  }
  return result
}

function replaceSqrt(expr: string): string {
  let result = expr
  let start = result.indexOf("\\sqrt{")
  while (start !== -1) {
    const innerStart = start + 6
    const innerEnd = findMatchingBrace(result, innerStart)
    if (innerEnd === -1) break
    const inner = result.slice(innerStart, innerEnd)
    const before = result.slice(0, start)
    const after = result.slice(innerEnd + 1)
    result = `${before}sqrt(${inner})${after}`
    start = result.indexOf("\\sqrt{")
  }
  return result
}

function replaceFrac(expr: string): string {
  let result = expr
  let start = result.indexOf("\\frac{")
  while (start !== -1) {
    const numStart = start + 6
    const numEnd = findMatchingBrace(result, numStart)
    if (numEnd === -1) break
    const num = result.slice(numStart, numEnd)
    const denStart = numEnd + 2
    if (result[denStart - 1] !== "{") break
    const denEnd = findMatchingBrace(result, denStart)
    if (denEnd === -1) break
    const den = result.slice(denStart, denEnd)
    void num
    void den
    const before = result.slice(0, start)
    const after = result.slice(denEnd + 1)
    result = `${before}((${num})/(${den}))${after}`
    start = result.indexOf("\\frac{")
  }
  return result
}

function findMatchingBrace(str: string, start: number): number {
  let depth = 1
  for (let i = start; i < str.length; i++) {
    if (str[i] === "{") {
      depth++
    } else if (str[i] === "}") {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

function replacePowers(expr: string): string {
  let result = expr
  let caret = result.lastIndexOf("^")
  while (caret !== -1) {
    if (result[caret + 1] === "{") {
      const innerStart = caret + 2
      const innerEnd = findMatchingBrace(result, innerStart)
      if (innerEnd !== -1) {
        const base = result.slice(0, caret)
        const exp = result.slice(innerStart, innerEnd)
        const after = result.slice(innerEnd + 1)
        result = `${base}**(${exp})${after}`
      }
    } else {
      const innerStart = caret + 1
      const innerEnd = findPowerEnd(result, innerStart)
      const base = result.slice(0, caret)
      const exp = result.slice(innerStart, innerEnd)
      const after = result.slice(innerEnd)
      result = `${base}**${exp}${after}`
    }
    caret = result.lastIndexOf("^")
  }
  return result
}

function findPowerEnd(str: string, start: number): number {
  if (str[start] === "{") {
    const end = findMatchingBrace(str, start + 1)
    return end === -1 ? start : end + 1
  }
  if (str[start] === "(") {
    const end = findMatchingParen(str, start + 1)
    return end === -1 ? start : end + 1
  }
  if (str[start] === "\\" && str[start + 1] === "{") {
    return findPowerEnd(str, start + 1)
  }
  let i = start
  if (str[i] === "-") i++
  while (i < str.length && (/[a-zA-Z0-9]/).test(str[i] ?? "")) {
    i++
  }
  return i === start ? start + 1 : i
}

function findMatchingParen(str: string, start: number): number {
  let depth = 1
  for (let i = start; i < str.length; i++) {
    if (str[i] === "(") {
      depth++
    } else if (str[i] === ")") {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

export type PlotDataEntry = {
  fn: string
  color: string
}

export function parseLatexToFunctionPlotData(input: string, color?: string): PlotDataEntry[] {
  const parts = splitBySemicolon(input)
  const baseColor = color ?? "#6366f1"
  const colors = generatePlotColors(baseColor, parts.length)
  return parts
    .map((part, index) => {
      const expression = extractExpression(part)
      if (!expression) return undefined
      const fn = latexToJsExpr(expression)
      if (!fn) return undefined
      return { fn, color: colors[index] ?? baseColor }
    })
    .filter((entry): entry is PlotDataEntry => entry !== undefined)
}

function splitBySemicolon(input: string): string[] {
  const parts: string[] = []
  let current = ""
  let depth = 0
  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    if (char === "{" || char === "(") {
      depth++
      current += char
    } else if (char === "}" || char === ")") {
      depth--
      current += char
    } else if (char === ";" && depth === 0) {
      parts.push(current)
      current = ""
    } else {
      current += char
    }
  }
  if (current || parts.length === 0) {
    parts.push(current)
  }
  return parts
}

function extractExpression(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ""
  if (FN_PREFIX.test(trimmed)) {
    return trimmed.replace(FN_PREFIX, "")
  }
  if (Y_PREFIX.test(trimmed)) {
    return trimmed.replace(Y_PREFIX, "")
  }
  return trimmed
}

export function generatePlotColors(baseColor: string, count: number): string[] {
  if (count <= 1) return [baseColor]
  const hsl = hexToHsl(baseColor)
  if (!hsl) return Array.from({ length: count }, () => baseColor)
  const { h, s, l } = hsl
  const colors: string[] = []
  for (let i = 0; i < count; i++) {
    const hue = (h + (i * 360) / count) % 360
    colors.push(hslToHex(hue, s, l))
  }
  return colors
}

function hexToHsl(hex: string): { h: number; s: number; l: number } | undefined {
  const normalized = hex.replace("#", "")
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return undefined
  const r = parseInt(normalized.slice(0, 2), 16) / 255
  const g = parseInt(normalized.slice(2, 4), 16) / 255
  const b = parseInt(normalized.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToHex(h: number, s: number, l: number): string {
  const normalizedS = s / 100
  const normalizedL = l / 100
  const c = (1 - Math.abs(2 * normalizedL - 1)) * normalizedS
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = normalizedL - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (h >= 0 && h < 60) {
    r = c
    g = x
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
  } else if (h >= 120 && h < 180) {
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }
  const toHex = (value: number): string => {
    const int = Math.round((value + m) * 255)
    return int.toString(16).padStart(2, "0")
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

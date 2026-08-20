export type RGB = { r: number; g: number; b: number }

export function hexToRgb(hex: string): RGB | null {
  const normalized = hex.replace("#", "").trim().toLowerCase()
  if (!/^[0-9a-f]{6}$/.test(normalized) && !/^[0-9a-f]{3}$/.test(normalized)) {
    return null
  }
  let full = normalized
  if (normalized.length === 3) {
    full = normalized
      .split("")
      .map((char) => char + char)
      .join("")
  }
  const value = parseInt(full, 16)
  return {
    r: (value >>> 16) & 255,
    g: (value >>> 8) & 255,
    b: value & 255,
  }
}

export function relativeLuminance(rgb: RGB): number {
  const channels = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const srgb = channel / 255
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * (channels[0] ?? 0) + 0.7152 * (channels[1] ?? 0) + 0.0722 * (channels[2] ?? 0)
}

export function contrastRatio(a: RGB, b: RGB): number {
  const l1 = relativeLuminance(a)
  const l2 = relativeLuminance(b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function ratioForHexPair(fg: string, bg: string): number | null {
  const fgRgb = hexToRgb(fg)
  const bgRgb = hexToRgb(bg)
  if (!fgRgb || !bgRgb) return null
  return contrastRatio(fgRgb, bgRgb)
}

export function passesAA(fg: string, bg: string, size: "normal" | "large" = "normal"): boolean {
  const ratio = ratioForHexPair(fg, bg)
  if (ratio === null) return false
  const threshold = size === "large" ? 3 : 4.5
  return ratio >= threshold
}

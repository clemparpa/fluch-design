#!/usr/bin/env node
// Convertit des couleurs hex / rgb en OKLCH (format Tailwind v4 / CSS Color 4).
// Déterministe — l'agent doit utiliser ce script plutôt que de calculer à la main.
//
// Usage:
//   node oklch.mjs "#635bff"
//   node oklch.mjs "#635bff" "#0a2540" "#df1b41"
//   node oklch.mjs "rgb(84, 105, 212)"
//
// Sortie: une ligne "oklch(L C H)" par couleur en entrée.

function parseColor(input) {
  const s = input.trim().toLowerCase()
  if (s.startsWith('#')) {
    let h = s.slice(1)
    if (h.length === 3) h = [...h].map((c) => c + c).join('')
    if (h.length !== 6) throw new Error(`hex invalide: ${input}`)
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255,
    ]
  }
  const m = s.match(/^rgba?\(\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)/)
  if (m) {
    return [m[1], m[2], m[3]].map((v) =>
      v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v) / 255,
    )
  }
  throw new Error(`format non supporté: ${input}`)
}

const srgbToLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

function linearToOklab([r, g, b]) {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)
  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ]
}

function oklabToOklch([L, a, b]) {
  const C = Math.sqrt(a * a + b * b)
  let H = (Math.atan2(b, a) * 180) / Math.PI
  if (H < 0) H += 360
  return [L, C, H]
}

function convert(input) {
  const rgb = parseColor(input)
  const linear = rgb.map(srgbToLinear)
  const oklab = linearToOklab(linear)
  const [L, C, H] = oklabToOklch(oklab)
  const cRounded = Math.round(C * 1000) / 1000
  const hOut = cRounded < 0.001 ? 0 : Math.round(H)
  return `oklch(${L.toFixed(3)} ${cRounded.toFixed(3)} ${hOut})`
}

const args = process.argv.slice(2)
if (!args.length) {
  console.error('Usage: node oklch.mjs "#hex" ["#hex" ...]')
  process.exit(1)
}

for (const arg of args) {
  try {
    console.log(convert(arg))
  } catch (e) {
    console.error(`Erreur "${arg}": ${e.message}`)
    process.exit(1)
  }
}

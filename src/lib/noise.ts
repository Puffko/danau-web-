// Small deterministic noise helpers shared by the dot-matrix canvases.

export const hash = (x: number, y: number, s: number) => {
  let h = Math.imul(x * 374761393 + y * 668265263 + s * 2246822519, 1274126177)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

export const smooth = (t: number) => t * t * (3 - 2 * t)

// 1D value noise with a few octaves, used to make ridges jagged.
export const noise1 = (x: number, s: number) => {
  let total = 0
  let amp = 1
  let freq = 1
  let norm = 0
  for (let o = 0; o < 4; o++) {
    const xi = Math.floor(x * freq)
    const t = smooth(x * freq - xi)
    const a = hash(xi, o, s)
    const b = hash(xi + 1, o, s)
    total += (a + (b - a) * t) * amp
    norm += amp
    amp *= 0.5
    freq *= 2.1
  }
  return total / norm
}

export const noise2 = (x: number, y: number, s: number) => {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const tx = smooth(x - xi)
  const ty = smooth(y - yi)
  const a = hash(xi, yi, s)
  const b = hash(xi + 1, yi, s)
  const c = hash(xi, yi + 1, s)
  const d = hash(xi + 1, yi + 1, s)
  return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty
}

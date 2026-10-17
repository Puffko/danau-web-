/**
 * Sizes a canvas to w × h CSS pixels at the screen's pixel density (capped at maxDpr) and scales
 * its context to match, so drawing stays in CSS pixels and comes out sharp. Returns the density.
 */
export function fitCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, w: number, h: number, maxDpr = 2) {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return dpr
}

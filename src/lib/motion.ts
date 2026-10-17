/** The motion curves the components share; the CSS has the same two as --ease and --ease-io. */

/** Fast start, long settle: entrances and most movement. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const

/** Even in and out: lines that draw and things that travel between two places. */
export const EASE_IO = [0.65, 0, 0.35, 1] as const

/** A gentler ease-out for fades that run beside a movement. */
export const EASE_FADE = [0.33, 1, 0.68, 1] as const

/** The visitor asked for less motion (false while prerendering, where there is no window). */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

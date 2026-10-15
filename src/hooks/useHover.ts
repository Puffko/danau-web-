import { useState } from 'react'

/** Hover-or-focus state for elements that drive a pixel cluster. */
export function useHover() {
  const [active, setActive] = useState(false)
  const handlers = {
    onPointerEnter: () => setActive(true),
    onPointerLeave: () => setActive(false),
    onFocus: () => setActive(true),
    onBlur: () => setActive(false),
  }
  return [active, handlers] as const
}

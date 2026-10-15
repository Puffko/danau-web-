import type { SVGProps } from 'react'
import type { ServiceIconName } from '../data/site'

type P = SVGProps<SVGSVGElement>

const base = (props: P) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...props,
})

const servicePaths: Record<ServiceIconName, string[]> = {
  project: [
    'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
    'M20 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z',
  ],
  security: [
    'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z',
    'm9 12 2 2 4-4',
  ],
  gdpr: [
    'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
    'M14 2v4a2 2 0 0 0 2 2h4',
    'M10 9H8',
    'M16 13H8',
    'M16 17H8',
  ],
  analytics: ['M3 3v16a2 2 0 0 0 2 2h16', 'M18 17V9', 'M13 17V5', 'M8 17v-3'],
  data: [
    'M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3Z',
    'M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5',
    'M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3',
  ],
  delivery: [
    'M10 7.75a.75.75 0 0 1 1.14-.64l3.67 2.25a.75.75 0 0 1 0 1.28l-3.67 2.25a.75.75 0 0 1-1.14-.64Z',
    'M12 17v4',
    'M8 21h8',
    'M20 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z',
  ],
}

export function ServiceIcon({ name, ...props }: P & { name: ServiceIconName }) {
  return (
    <svg {...base(props)}>
      {servicePaths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

export const ArrowRight = (props: P) => (
  <svg {...base({ viewBox: '0 0 16 16', width: 16, height: 16, strokeWidth: 1.8, ...props })}>
    <path d="M3.33 8h9.34" />
    <path d="M8 3.33 12.67 8 8 12.67" />
  </svg>
)

export const ArrowUpRight = (props: P) => (
  <svg {...base({ viewBox: '0 0 16 16', width: 16, height: 16, strokeWidth: 1.8, ...props })}>
    <path d="M4.5 11.5 11.5 4.5" />
    <path d="M5.5 4.5h6v6" />
  </svg>
)

export const Caret = (props: P) => (
  <svg {...base({ viewBox: '0 0 16 16', width: 14, height: 14, strokeWidth: 2, ...props })}>
    <path d="M4 6l4 4 4-4" />
  </svg>
)

export const Check = (props: P) => (
  <svg {...base({ viewBox: '0 0 16 16', width: 16, height: 16, strokeWidth: 2, ...props })}>
    <path d="m3.5 8.5 3 3 6-7" />
  </svg>
)

export const Mail = (props: P) => (
  <svg {...base(props)}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </svg>
)

export const Phone = (props: P) => (
  <svg {...base(props)}>
    <path d="M21 16.9v2.6a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h2.6a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.2 10.8a16 16 0 0 0 5 5l1.2-1.2a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
)

export const Pin = (props: P) => (
  <svg {...base(props)}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const Star = (props: P) => (
  <svg viewBox="0 0 23 23" width="23" height="23" aria-hidden focusable={false} {...props}>
    <path
      fill="currentColor"
      d="M11.49 0l.65 3.95a8.5 8.5 0 0 0 6.89 6.89l3.95.65-3.95.65a8.5 8.5 0 0 0-6.89 6.89l-.65 3.95-.65-3.95a8.5 8.5 0 0 0-6.89-6.89L0 11.49l3.95-.65a8.5 8.5 0 0 0 6.89-6.89Z"
    />
  </svg>
)

export const Pause = (props: P) => (
  <svg {...base({ viewBox: '0 0 16 16', width: 14, height: 14, strokeWidth: 2, ...props })}>
    <path d="M5.5 3.5v9" />
    <path d="M10.5 3.5v9" />
  </svg>
)

export const Play = (props: P) => (
  <svg {...base({ viewBox: '0 0 16 16', width: 14, height: 14, strokeWidth: 1.6, ...props })}>
    <path d="M5 3.2v9.6a.5.5 0 0 0 .76.43l7.6-4.8a.5.5 0 0 0 0-.86l-7.6-4.8A.5.5 0 0 0 5 3.2Z" fill="currentColor" />
  </svg>
)

export const Menu = (props: P) => (
  <svg {...base(props)}>
    <path d="M4 8h16" />
    <path d="M4 16h16" />
  </svg>
)

export const Close = (props: P) => (
  <svg {...base(props)}>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </svg>
)

/** The four-quadrant Danau "D" symbol. */
export const DSymbol = (props: P) => (
  <svg viewBox="0 0 41.7 41.7" aria-hidden focusable={false} {...props}>
    <g fill="currentColor">
      <path d="M0 20.85h20.85c0 11.52-9.34 20.85-20.85 20.85Z" />
      <path d="M20.85 20.85V0C32.37 0 41.7 9.34 41.7 20.85Z" />
      <path d="M20.85 20.85H41.7c0 11.52-9.34 20.85-20.85 20.85Z" />
      <path d="M0 0h20.85L9.92 10.68 0 20.85Z" />
    </g>
  </svg>
)

import { motion, useReducedMotion } from 'motion/react'
import { useId, type ReactNode } from 'react'
import { PixelSphere } from './PixelSphere'
import { EASE_OUT, Reveal } from './Reveal'

// Geometry in the stage's viewBox units (1200 x 720). Mirrored stages flip it horizontally.
const W = 1200
const H = 720
const CX = 880
const CY = 360
const R = 300
const ARC = 350
const NODE_Y = [196, 528]
/** Where the connector lines stop short of the notes (notes sit at the left, or at the right when mirrored). */
const LINE_END = 250
const LINE_END_MIRRORED = 770

interface Note {
  label: string
  text: string
}

interface Props {
  notes: [Note, Note]
  result: { title: string; text: string; extra?: ReactNode }
  /** Sphere on the left, notes on the right. */
  mirrored?: boolean
  /** On narrow screens, list both notes before the sphere (default: sphere between them). */
  resultLast?: boolean
  seed?: number
}

/**
 * Two notes joined by an arc to a half-pixel, half-blur sphere that holds the conclusion.
 * Collapses to a stacked list below 1200px.
 */
export function SphereDiagram({ notes, result, mirrored = false, resultLast = false, seed = 0 }: Props) {
  const reduce = useReducedMotion()
  const gradientId = useId()
  const cx = mirrored ? W - CX : CX
  const arcTop = CY - ARC
  const arcBottom = CY + ARC
  const arcX = (y: number) => {
    const dx = Math.sqrt(ARC ** 2 - (y - CY) ** 2)
    return mirrored ? cx + dx : cx - dx
  }
  const lineEnd = mirrored ? LINE_END_MIRRORED : LINE_END
  const draw = (delay: number, duration = 1.4) => ({
    initial: { pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: '0px 0px -20% 0px' },
    transition: { duration, delay, ease: [0.65, 0, 0.35, 1] as const },
  })

  return (
    <div
      className={`process-stage${mirrored ? ' process-stage--mirrored' : ''}${resultLast ? ' process-stage--result-last' : ''}`}
    >
      <svg className="process-stage__lines" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1={arcTop} x2="0" y2={arcBottom} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1818ec" stopOpacity="0" />
            <stop offset="0.22" stopColor="#1818ec" stopOpacity="0.7" />
            <stop offset="0.78" stopColor="#1818ec" stopOpacity="0.7" />
            <stop offset="1" stopColor="#1818ec" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`M ${cx} ${arcTop} A ${ARC} ${ARC} 0 0 ${mirrored ? 1 : 0} ${cx} ${arcBottom}`}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.2"
          {...draw(0.1, 1.8)}
        />
        {NODE_Y.map((y, i) => (
          <g key={y}>
            <motion.path
              d={`M ${lineEnd} ${y} H ${arcX(y)}`}
              stroke="#1818ec"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              {...draw(0.7 + i * 0.25, 0.9)}
            />
            <motion.circle
              cx={arcX(y)}
              cy={y}
              r="6"
              fill="#1818ec"
              initial={{ scale: reduce ? 1 : 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: '0px 0px -20% 0px' }}
              transition={{ delay: 1.2 + i * 0.25, duration: 0.6, ease: EASE_OUT }}
              style={{ transformOrigin: `${arcX(y)}px ${y}px`, transformBox: 'view-box' }}
            />
            <circle
              className="process-stage__ping"
              cx={arcX(y)}
              cy={y}
              r="6"
              fill="none"
              stroke="#1818ec"
              style={{ animationDelay: `${i * 1.3}s` }}
            />
          </g>
        ))}
      </svg>

      {notes.map((n, i) => (
        <Reveal
          key={n.label}
          className={`process-note process-note--${i + 1}`}
          delay={0.5 + i * 0.25}
          style={{ ['--y' as string]: `${(NODE_Y[i] / H) * 100}%` }}
        >
          <span className="process-note__pill">{n.label}</span>
          <p className="process-note__text">{n.text}</p>
        </Reveal>
      ))}

      <div
        className="process-orb"
        style={{
          ['--cx' as string]: `${(cx / W) * 100}%`,
          ['--cy' as string]: `${(CY / H) * 100}%`,
          ['--d' as string]: `${((R * 2) / W) * 100}%`,
        }}
      >
        <PixelSphere className="process-orb__sphere" mirrored={mirrored} seed={seed} />
        <Reveal className="process-orb__solution" delay={0.9}>
          <h3 className="process-orb__title">{result.title}</h3>
          <p className="process-orb__text">{result.text}</p>
          {result.extra}
        </Reveal>
      </div>
    </div>
  )
}

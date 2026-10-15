import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { PixelSphere } from './PixelSphere'
import { EASE_OUT } from './Reveal'

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

/** Matches the CSS breakpoint above which the stage is drawn as a diagram instead of a stacked list. */
const WIDE = '(min-width: 1201px)'
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const getWide = () => window.matchMedia(WIDE).matches

/**
 * The diagram builds itself in one continuous flow once it is in view (seconds from that
 * moment): the arc grows out from its middle, each note rises and its line runs to the arc,
 * the node fades in exactly where the line arrives, and the sphere's pixels pour in from the
 * arc side as one wave behind them. The nodes pulse only once everything has settled.
 */
const LINE_DURATION = 0.8
const T = {
  arc: 0.2,
  sphere: 0.35,
  note: (i: number) => 0.3 + i * 0.2,
  line: (i: number) => 0.45 + i * 0.2,
  node: (i: number) => 0.45 + i * 0.2 + LINE_DURATION - 0.08,
  result: 1.3,
  live: 2.8,
}
const EASE_IO = [0.65, 0, 0.35, 1] as const

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
 * Collapses to a stacked list below 1200px, where each part enters on its own as it is scrolled to.
 */
export function SphereDiagram({ notes, result, mirrored = false, resultLast = false, seed = 0 }: Props) {
  const reduce = !!useReducedMotion()
  const gradientId = useId()
  const stageRef = useRef<HTMLDivElement>(null)
  const wide = useSyncExternalStore(subscribeWide, getWide, () => true)
  const inView = useInView(stageRef, { once: true, amount: 0.2 })
  // narrower layouts: the sphere starts assembling as soon as its own box comes into view
  const orbRef = useRef<HTMLDivElement>(null)
  const orbSeen = useInView(orbRef, { once: true, margin: '0px 0px -4% 0px' })
  const play = reduce || inView
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!play) return
    const id = window.setTimeout(() => setLive(true), reduce ? 0 : T.live * 1000)
    return () => window.clearTimeout(id)
  }, [play, reduce])

  const cx = mirrored ? W - CX : CX
  const arcTop = CY - ARC
  const arcBottom = CY + ARC
  const arcX = (y: number) => {
    const dx = Math.sqrt(ARC ** 2 - (y - CY) ** 2)
    return mirrored ? cx + dx : cx - dx
  }
  const midX = mirrored ? cx + ARC : cx - ARC
  const lineEnd = mirrored ? LINE_END_MIRRORED : LINE_END

  const stroke = (delay: number, duration: number) => ({
    initial: reduce ? false : { pathLength: 0, opacity: 0 },
    animate: play ? { pathLength: 1, opacity: 1 } : undefined,
    transition: {
      pathLength: { duration, delay, ease: EASE_IO },
      opacity: { duration: 0.2, delay },
    },
  })

  return (
    <div
      ref={stageRef}
      className={`process-stage${mirrored ? ' process-stage--mirrored' : ''}${resultLast ? ' process-stage--result-last' : ''}${live ? ' is-live' : ''}`}
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
        {/* the arc grows from its middle towards both ends */}
        {[
          [arcTop, mirrored ? 0 : 1],
          [arcBottom, mirrored ? 1 : 0],
        ].map(([endY, sweep]) => (
          <motion.path
            key={endY}
            d={`M ${midX} ${CY} A ${ARC} ${ARC} 0 0 ${sweep} ${cx} ${endY}`}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="1.2"
            {...stroke(T.arc, 1.3)}
          />
        ))}
        {NODE_Y.map((y, i) => (
          <g key={y}>
            <motion.path
              d={`M ${lineEnd} ${y} H ${arcX(y)}`}
              stroke="#1818ec"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              {...stroke(T.line(i), LINE_DURATION)}
            />
            <motion.circle
              cx={arcX(y)}
              cy={y}
              r="6"
              fill="#1818ec"
              initial={reduce ? false : { scale: 0.3, opacity: 0 }}
              animate={play ? { scale: 1, opacity: 1 } : undefined}
              transition={{
                scale: { duration: 0.5, delay: T.node(i), ease: EASE_OUT },
                opacity: { duration: 0.35, delay: T.node(i) },
              }}
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
        <Step
          key={n.label}
          className={`process-note process-note--${i + 1}`}
          go={wide ? play : undefined}
          delay={T.note(i)}
          stackDelay={i * 0.12}
          style={{ ['--y' as string]: `${(NODE_Y[i] / H) * 100}%` }}
        >
          <span className="process-note__pill">{n.label}</span>
          <p className="process-note__text">{n.text}</p>
        </Step>
      ))}

      <div
        ref={orbRef}
        className="process-orb"
        style={{
          ['--cx' as string]: `${(cx / W) * 100}%`,
          ['--cy' as string]: `${(CY / H) * 100}%`,
          ['--d' as string]: `${((R * 2) / W) * 100}%`,
        }}
      >
        <PixelSphere
          className="process-orb__sphere"
          mirrored={mirrored}
          seed={seed}
          play={wide ? play : reduce || orbSeen}
          delay={wide ? T.sphere * 1000 : 0}
        />
        <Step className="process-orb__solution" go={wide ? play : undefined} delay={T.result} stackDelay={0.5}>
          <h3 className="process-orb__title">{result.title}</h3>
          <p className="process-orb__text">{result.text}</p>
          {result.extra}
        </Step>
      </div>
    </div>
  )
}

/**
 * A rise-and-fade block. `go` hands its timing to the diagram's sequence; left undefined
 * (narrower layouts) it enters as it comes into view, after `stackDelay`.
 */
function Step({
  go,
  delay = 0,
  stackDelay = 0,
  className,
  style,
  children,
}: {
  go?: boolean
  delay?: number
  stackDelay?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const seen = useInView(ref, { once: true, margin: '0px 0px -4% 0px' })
  const on = go ?? seen
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={on ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: reduce ? 0.4 : 1, delay: go === undefined ? stackDelay : delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

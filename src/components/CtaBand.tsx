import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { routes } from '../data/site'
import { ArrowUpRight, DSymbol } from './Icons'
import { EASE_OUT, RevealText } from './Reveal'

// Positions of the drifting D symbols, as % of the band.
const SYMBOLS = [
  { x: -4, y: -30, s: 220, r: 0, d: 0 },
  { x: 14, y: 58, s: 120, r: 90, d: 1.2 },
  { x: 78, y: -40, s: 180, r: 180, d: 0.6 },
  { x: 88, y: 55, s: 240, r: 270, d: 1.8 },
  { x: 46, y: 78, s: 90, r: 90, d: 2.4 },
]

export function CtaBand({ title, action = 'Ozvite sa nám' }: { title: string; action?: string }) {
  const reduce = useReducedMotion()
  return (
    <section className="section section--tight">
      <div className="container">
        <motion.div
          className="cta-band"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1, ease: EASE_OUT }}
          data-theme="dark"
        >
          <div className="cta-band__pattern" aria-hidden="true" />
          {SYMBOLS.map((s, i) => (
            <motion.span
              key={i}
              className="cta-band__symbol"
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, rotate: s.r }}
              animate={reduce ? undefined : { y: [0, -14, 0], rotate: [s.r, s.r + 6, s.r] }}
              transition={{ duration: 9, delay: s.d, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              <DSymbol width="100%" height="100%" />
            </motion.span>
          ))}
          <div className="cta-band__inner">
            <RevealText as="h2" className="cta-band__title" text={title} />
            <Link to={routes.contact} className="btn btn--pill btn--light">
              <span>{action}</span>
              <ArrowUpRight />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

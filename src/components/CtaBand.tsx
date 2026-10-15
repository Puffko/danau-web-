import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { routes } from '../data/site'
import { ArrowUpRight } from './Icons'
import { PixelMountains } from './PixelMountains'
import { EASE_OUT, RevealText } from './Reveal'

interface Props {
  title: string
  action?: string
  /** Shifts the pixel range so each page's band has its own skyline. */
  seed?: number
}

export function CtaBand({ title, action = 'Ozvite sa nám', seed = 7 }: Props) {
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
          data-pixel-host
        >
          <PixelMountains className="cta-band__mountains" variant="low" seed={seed} />
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

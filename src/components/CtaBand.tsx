import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { ArrowUpRight } from './Icons'
import { PixelMountains } from './PixelMountains'
import { EASE_OUT } from '../lib/motion'
import { RevealText } from './Reveal'

interface Props {
  title: string
  action?: string
  /** Shifts the pixel range so each page's band has its own skyline. */
  seed?: number
}

export function CtaBand({ title, action, seed = 7 }: Props) {
  const reduce = useReducedMotion()
  const { t, paths } = useI18n()
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
            <Link to={paths.contact} className="btn btn--light">
              <span>{action ?? t.ui.ctaAction}</span>
              <ArrowUpRight />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

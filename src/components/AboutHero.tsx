import { motion, useReducedMotion } from 'motion/react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { ArrowUpRight } from './Icons'
import { PixelMark } from './PixelMark'
import { PixelMountains } from './PixelMountains'
import { EASE_IO, EASE_OUT } from '../lib/motion'
import { Reveal, RevealReady, RevealText } from './Reveal'

/**
 * The About hero: DANAU's own mark, built from the site's matrix, stands beside the sentence that
 * says who the company is (its top level with the title, its foot with the copy's last line), with
 * one action under a hairline. Under 960px the mark and the title lock up like the wordmark.
 */
export function AboutHero() {
  const { t, paths } = useI18n()
  const reduce = useReducedMotion()
  const ready = useContext(RevealReady)
  return (
    <section className="page-hero about-hero" data-pixel-host data-theme="dark" aria-labelledby="about-hero-title">
      <div className="hero-glow" aria-hidden="true" />
      <PixelMountains className="page-hero__mountains" variant="low" seed={9} />
      <div className="container about-hero__inner">
        <div className="about-hero__copy">
          <RevealText
            as="h1"
            id="about-hero-title"
            immediate
            className="about-hero__title"
            text={t.about.title}
            delay={0.15}
            stagger={0.06}
            shine="light"
          />
          <RevealText
            as="p"
            immediate
            className="about-hero__statement"
            text={t.about.text}
            delay={0.45}
            stagger={0.012}
          />
          <div className="about-hero__sign">
            <motion.span
              className="about-hero__rule"
              aria-hidden="true"
              initial={reduce ? false : { scaleX: 0 }}
              animate={ready ? { scaleX: 1 } : undefined}
              transition={{ duration: 1.1, delay: 1.0, ease: EASE_IO }}
            />
            <motion.span
              className="about-hero__pixel"
              aria-hidden="true"
              initial={reduce ? false : { scale: 0 }}
              animate={ready ? { scale: 1 } : undefined}
              transition={{ duration: 0.5, delay: 0.95, ease: EASE_OUT }}
            />
            <Reveal immediate delay={1.15} y={12} className="about-hero__sign-body">
              <Link to={paths.contact} className="btn btn--light">
                <span>{t.home.hero.primary}</span>
                <ArrowUpRight />
              </Link>
            </Reveal>
          </div>
        </div>
        <div className="about-hero__mark" aria-hidden="true">
          {/* the D's own square: top-aligned with the title on desktop, filling the mark below */}
          <div className="about-hero__mark-box">
            <PixelMark className="about-hero__mark-canvas" />
          </div>
        </div>
      </div>
    </section>
  )
}

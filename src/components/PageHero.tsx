import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { ArrowRight } from './Icons'
import { PixelMountains } from './PixelMountains'
import { Reveal, RevealText } from './Reveal'

interface Props {
  title: string
  text?: string
  back?: boolean
  aside?: ReactNode
  seed?: number
  size?: 'md' | 'sm'
  children?: ReactNode
}

/** Dark sub-page hero: the home hero's glow and pixel range at a lower altitude. */
export function PageHero({ title, text, back, aside, seed = 5, size = 'md', children }: Props) {
  const { t, servicesSection } = useI18n()
  return (
    <section className={`page-hero page-hero--${size}`} data-pixel-host data-theme="dark">
      <div className="hero-glow" aria-hidden="true" />
      <PixelMountains className="page-hero__mountains" variant="low" seed={seed} />
      <div className={`container page-hero__inner${aside ? ' has-aside' : ''}`}>
        <div className="page-hero__copy">
          {back && (
            <Reveal immediate y={10}>
              <Link to={servicesSection} className="back-link">
                <ArrowRight className="back-link__icon" />
                <span>{t.ui.backToServices}</span>
              </Link>
            </Reveal>
          )}
          <RevealText as="h1" immediate className="page-hero__title" text={title} delay={0.1} />
          {text && (
            <RevealText as="p" immediate className="page-hero__text" text={text} delay={0.5} stagger={0.014} />
          )}
          {children}
        </div>
        {aside && <div className="page-hero__aside">{aside}</div>}
      </div>
    </section>
  )
}

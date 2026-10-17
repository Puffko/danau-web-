import { useInView } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Service } from '../data/site'
import { useI18n } from '../i18n'
import { ArrowRight, ServiceIcon } from './Icons'
import { PixelCluster } from './PixelCluster'
import { PixelGlyph } from './PixelGlyph'

interface Props {
  service: Service
  compact?: boolean
  /** Home grid: a night window above the text, with the service's pixel glyph. */
  face?: boolean
  moreLabel?: string
  /** Varies the pixel corner between cards. */
  seed?: number
}

export function ServiceCard({ service, compact = false, face = false, moreLabel, seed = 0 }: Props) {
  const [active, setActive] = useState(false)
  const { t, servicePath } = useI18n()

  const chip = (
    <span className="chip">
      <ServiceIcon name={service.icon} width={20} height={20} />
    </span>
  )
  const more = (
    <span className="service-card__more">
      {!compact && <span>{moreLabel ?? t.home.services.more}</span>}
      <span className="service-card__arrow">
        <ArrowRight />
      </span>
    </span>
  )

  return (
    <Link
      to={servicePath(service)}
      className={`service-card${compact ? ' service-card--compact' : ''}${face ? ' service-card--face' : ''}${active ? ' is-active' : ''}`}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      {face ? (
        <>
          <ServiceFace service={service} active={active} seed={seed}>
            {chip}
          </ServiceFace>
          <div className="service-card__body">
            <h3 className="service-card__title">{service.name}</h3>
            <p className="service-card__text">{service.cardText}</p>
            {more}
          </div>
        </>
      ) : (
        <>
          <PixelCluster
            className="service-card__pixels"
            active={active}
            seed={seed}
            radius={compact ? 70 : 120}
            cell={compact ? 9 : 11}
            sparse
          />
          {chip}
          <h3 className="service-card__title">{service.name}</h3>
          {!compact && <p className="service-card__text">{service.cardText}</p>}
          {more}
        </>
      )}
    </Link>
  )
}

/**
 * The card's night window: a small copy of the service page's hero, lit from below, with the
 * service's pixel glyph in the middle, the chip and the hover mosaic in its top corners. The
 * glyph mounts when the window first scrolls into view, so it assembles in front of the reader,
 * and holds still at rest.
 */
function ServiceFace({
  service,
  active,
  seed,
  children,
}: {
  service: Service
  active: boolean
  seed: number
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  // the hover mosaic keeps to the window's top-right at every size: half its height, in 4px
  // steps so a resize does not restart the canvas on every pixel
  const [radius, setRadius] = useState(96)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const r = Math.round((entry.contentRect.height * 0.5) / 4) * 4
      setRadius(Math.min(96, Math.max(64, r)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} className="service-card__face" aria-hidden="true">
      <PixelCluster className="service-card__pixels" active={active} seed={seed} radius={radius} cell={9} sparse />
      {seen && (
        <PixelGlyph name={service.illustration} tone="dark" pace={0.7} live={active} className="service-card__glyph" />
      )}
      {children}
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Service } from '../data/site'
import { ArrowRight, ServiceIcon } from './Icons'
import { PixelCluster } from './PixelCluster'

interface Props {
  service: Service
  compact?: boolean
  moreLabel?: string
  /** Varies the pixel corner between cards. */
  seed?: number
}

export function ServiceCard({ service, compact = false, moreLabel = 'Zistiť viac', seed = 0 }: Props) {
  const [active, setActive] = useState(false)
  return (
    <Link
      to={`/sluzby/${service.slug}`}
      className={`service-card${compact ? ' service-card--compact' : ''}${active ? ' is-active' : ''}`}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <PixelCluster
        className="service-card__pixels"
        active={active}
        seed={seed}
        radius={compact ? 70 : 120}
        cell={compact ? 9 : 11}
      />
      <span className="chip">
        <ServiceIcon name={service.icon} width={20} height={20} />
      </span>
      <h3 className="service-card__title">{compact ? service.navLabel : service.cardTitle}</h3>
      {!compact && <p className="service-card__text">{service.cardText}</p>}
      <span className="service-card__more">
        {!compact && <span>{moreLabel}</span>}
        <span className="service-card__arrow">
          <ArrowRight />
        </span>
      </span>
    </Link>
  )
}

import { Link } from 'react-router-dom'
import type { Service } from '../data/site'
import { ArrowRight, ServiceIcon } from './Icons'

interface Props {
  service: Service
  compact?: boolean
  moreLabel?: string
}

export function ServiceCard({ service, compact = false, moreLabel = 'Zistiť viac' }: Props) {
  return (
    <Link to={`/sluzby/${service.slug}`} className={`service-card${compact ? ' service-card--compact' : ''}`}>
      <span className="service-card__dots" aria-hidden="true" />
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

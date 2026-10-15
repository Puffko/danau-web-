import { Link } from 'react-router-dom'
import { ArrowRight } from '../components/Icons'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { useI18n } from '../i18n'

export default function NotFound() {
  const { t, paths, servicesSection } = useI18n()
  const copy = t.ui.notFound
  return (
    <PageHero title={copy.title} text={copy.text} seed={21}>
      <Reveal immediate delay={0.6} className="hero__actions">
        <Link to={paths.home} className="btn btn--pill btn--light">
          <span>{copy.home}</span>
          <ArrowRight />
        </Link>
        <Link to={servicesSection} className="btn btn--pill btn--ghost">
          <span>{copy.services}</span>
        </Link>
      </Reveal>
    </PageHero>
  )
}

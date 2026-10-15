import { Link } from 'react-router-dom'
import { ArrowRight } from '../components/Icons'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'

export default function NotFound() {
  return (
    <PageHero
      title="Táto stránka ešte neexistuje."
      text="Adresa, ktorú ste otvorili, na webe nie je. Pokračujte na hlavnú stránku alebo do prehľadu služieb."
      seed={21}
    >
      <Reveal immediate delay={0.6} className="hero__actions">
        <Link to="/" className="btn btn--pill btn--light">
          <span>Otvoriť hlavnú stránku</span>
          <ArrowRight />
        </Link>
        <Link to="/#sluzby" className="btn btn--pill btn--ghost">
          <span>Naše služby</span>
        </Link>
      </Reveal>
    </PageHero>
  )
}

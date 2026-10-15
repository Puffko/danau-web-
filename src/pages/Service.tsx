import { Link, useParams } from 'react-router-dom'
import { CtaBand } from '../components/CtaBand'
import { ArrowRight, Check } from '../components/Icons'
import { PixelGlyph } from '../components/PixelGlyph'
import { PageHero } from '../components/PageHero'
import { PixelCluster } from '../components/PixelCluster'
import { useHover } from '../hooks/useHover'
import { Reveal, RevealText } from '../components/Reveal'
import { ServiceCard } from '../components/ServiceCard'
import { serviceBySlug, services } from '../data/site'
import NotFound from './NotFound'

export default function Service() {
  const { slug } = useParams()
  const service = serviceBySlug(slug)
  if (!service) return <NotFound />

  const index = services.indexOf(service)
  const others = services.filter((s) => s !== service)

  return (
    <>
      <PageHero
        back
        title={service.heroTitle}
        text={service.heroText}
        seed={index * 2 + 1}
        aside={
          <div className="hero-art">
            <PixelGlyph name={service.illustration} className="hero-art__glyph" />
          </div>
        }
      />

      <section className="section service-body">
        <div className="container">
          {service.blocks.map((block, i) =>
            block.kind === 'link' ? (
              <div className="split split--rule" key={block.title}>
                <div className="split__head" />
                <div className="split__body">
                  <Reveal>
                    <LinkCard to={block.to} title={block.title} body={block.body} />
                  </Reveal>
                </div>
              </div>
            ) : (
              <div className={`split${i > 0 ? ' split--rule' : ''}`} key={block.title}>
                <div className="split__head">
                  <RevealText as="h2" className="display-3" text={block.title} />
                </div>
                <div className="split__body">
                  <Reveal>
                    <p className="lead">{block.body}</p>
                  </Reveal>
                  {block.list && (
                    <Reveal delay={0.1} className="checklist">
                      <PixelCluster className="checklist__pixels" seed={index * 3 + i} radius={110} />
                      <h3 className="checklist__title">{block.listTitle}</h3>
                      <ul>
                        {block.list.map((item) => (
                          <li key={item}>
                            <span className="checklist__mark">
                              <Check />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      <CtaBand title={service.ctaTitle} seed={index * 3 + 2} />

      <section className="section section--tight related">
        <div className="container">
          <RevealText as="h2" className="display-3" text="Ďalšie služby" />
          <ul className="related__grid">
            {others.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={i * 0.05}>
                <ServiceCard service={s} compact seed={i * 5} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

function LinkCard({ to, title, body }: { to: string; title: string; body: string }) {
  const [active, hover] = useHover()
  return (
    <Link to={to} className={`link-card${active ? ' is-active' : ''}`} {...hover}>
      <PixelCluster className="link-card__pixels" active={active} seed={9} radius={120} />
      <span>
        <h3 className="link-card__title">{title}</h3>
        <span className="link-card__text">{body}</span>
      </span>
      <span className="link-card__arrow">
        <ArrowRight />
      </span>
    </Link>
  )
}

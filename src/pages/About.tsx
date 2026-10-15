import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Mail, Phone, Pin, ServiceIcon } from '../components/Icons'
import { PageHero } from '../components/PageHero'
import { EASE_OUT, Reveal } from '../components/Reveal'
import { SectionTitle } from '../components/SectionTitle'
import { PixelGlyph } from '../components/PixelGlyph'
import { PixelCluster } from '../components/PixelCluster'
import { PixelMountains } from '../components/PixelMountains'
import { useHover } from '../hooks/useHover'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { about, contact, home, routes, serviceBySlug, type Service } from '../data/site'

export default function About() {
  // the area under the pointer or focus, shared by the paragraph and the hub
  const [activeArea, setActiveArea] = useState<string | null>(null)
  return (
    <>
      <PageHero
        title={about.title}
        text={about.text}
        seed={9}
        aside={<CompanyCard />}
      />

      <section className="section about-what" aria-labelledby="what-title">
        <div className="container">
          <div className="about-what__intro">
            <SectionTitle id="what-title" className="display-2" text={about.whatTitle} />
            <Reveal>
              <p className="about-what__statement">
                {about.whatParts.map((part, i) =>
                  typeof part === 'string' ? (
                    part
                  ) : (
                    <Link
                      key={i}
                      to={`/sluzby/${part.area}`}
                      className={`area-link${activeArea === part.area ? ' is-active' : ''}`}
                      onPointerEnter={() => setActiveArea(part.area)}
                      onPointerLeave={() => setActiveArea(null)}
                      onFocus={() => setActiveArea(part.area)}
                      onBlur={() => setActiveArea(null)}
                    >
                      {part.text}
                    </Link>
                  ),
                )}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="about-what__edge">{about.whatEdge}</p>
            </Reveal>
          </div>
          <AreasHub active={activeArea} onActive={setActiveArea} />
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="skills-title">
        <div className="container">
          <div className="skills-panel" data-theme="dark" data-pixel-host>
            <PixelMountains className="skills-panel__mountains" variant="low" seed={23} />
            <SectionTitle id="skills-title" className="display-2 skills-panel__title" text={about.skillsTitle} tone="light" />
            <ul className="skills-panel__grid">
              {about.skills.map((skill) => (
                <SkillCell key={skill.name} name={skill.name} area={skill.area} />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

// Hub geometry in the stage's viewBox units (1000 x 440): three areas on each side, joined in the centre.
const HUB = { w: 1000, h: 440, cx: 500, cy: 220, inner: 270, rows: [70, 220, 370] }

/** The six areas from the paragraph, wired into one Danau centre: the "one approach" made visible. */
function AreasHub({ active, onActive }: { active: string | null; onActive: (slug: string | null) => void }) {
  const reduce = useReducedMotion()
  const areas = about.areas.map((slug) => serviceBySlug(slug)).filter((s): s is Service => Boolean(s))
  const sides = [areas.slice(0, 3), areas.slice(3, 6)]

  const curve = (side: number, y: number) => {
    const x = side === 0 ? HUB.inner : HUB.w - HUB.inner
    const bend = side === 0 ? 120 : -120
    return `M ${x} ${y} C ${x + bend} ${y}, ${HUB.cx - bend * 0.9} ${HUB.cy}, ${HUB.cx} ${HUB.cy}`
  }

  return (
    <div className="hub">
      <svg className="hub__lines" viewBox={`0 0 ${HUB.w} ${HUB.h}`} aria-hidden="true">
        {sides.map((list, side) =>
          list.map((service, i) => {
            const d = curve(side, HUB.rows[i])
            return (
              <g key={`${side}-${i}`} className={active === service.slug ? 'is-active' : undefined}>
                <motion.path
                  d={d}
                  className="hub__line"
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                  transition={{ duration: 1.2, delay: 0.2 + i * 0.12 + side * 0.06, ease: [0.65, 0, 0.35, 1] }}
                />
                <path d={d} className="hub__flow" style={{ animationDelay: `${-(i * 0.7 + side * 0.35)}s` }} />
              </g>
            )
          }),
        )}
      </svg>

      <div className="hub__core">
        <span className="hub__ring" aria-hidden="true" />
        <PixelGlyph name="dsymbol" tone="light" className="hub__glyph" />
      </div>

      {sides.map((list, side) =>
        list.map((service, i) => (
          <Reveal
            key={service.slug}
            className={`hub__node hub__node--${side === 0 ? 'left' : 'right'}${active === service.slug ? ' is-active' : ''}`}
            style={{ ['--y' as string]: `${(HUB.rows[i] / HUB.h) * 100}%`, ['--i' as string]: side * 3 + i }}
            delay={0.35 + i * 0.1 + side * 0.05}
            y={12}
          >
            <Link
              to={`/sluzby/${service.slug}`}
              className="hub__link"
              onPointerEnter={() => onActive(service.slug)}
              onPointerLeave={() => onActive(null)}
              onFocus={() => onActive(service.slug)}
              onBlur={() => onActive(null)}
            >
              <span className="chip">
                <ServiceIcon name={service.icon} width={20} height={20} />
              </span>
              <span className="hub__label">{service.navLabel}</span>
            </Link>
          </Reveal>
        )),
      )}
    </div>
  )
}

function SkillCell({ name, area }: { name: string; area: string }) {
  return (
    <li className="skills-panel__cell">
      <span className="skills-panel__area">{area}</span>
      <span className="skills-panel__name">{name}</span>
    </li>
  )
}

/** The hero aside: who and where the company is, with the way to start a conversation. */
function CompanyCard() {
  const reduce = useReducedMotion()
  const [active, hover] = useHover()
  return (
    <motion.div
      className="company-card"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.45, ease: EASE_OUT }}
      {...hover}
    >
      <PixelCluster className="company-card__pixels" active={active} seed={21} radius={110} cell={10} />
      <span className="company-card__label">
        <Pin width={16} height={16} /> Sídlo spoločnosti
      </span>
      <p className="company-card__name">{contact.company}</p>
      <address className="company-card__address">
        <a href={contact.mapsHref} target="_blank" rel="noreferrer">
          {contact.street}
          <br />
          {contact.city}, {contact.country}
        </a>
      </address>
      <ul className="company-card__rows">
        <li>
          <a href={`mailto:${contact.email}`}>
            <span className="company-card__icon">
              <Mail width={16} height={16} />
            </span>
            {contact.email}
          </a>
        </li>
        <li>
          <a href={contact.phoneHref}>
            <span className="company-card__icon">
              <Phone width={16} height={16} />
            </span>
            {contact.phone}
          </a>
        </li>
      </ul>
      <Link to={routes.contact} className="btn btn--pill btn--light company-card__cta">
        <span>{home.hero.primary}</span>
        <ArrowUpRight />
      </Link>
    </motion.div>
  )
}

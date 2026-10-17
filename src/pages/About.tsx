import { motion, useReducedMotion } from 'motion/react'
import { AboutHero } from '../components/AboutHero'
import { DSymbol, ServiceIcon } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { SectionTitle } from '../components/SectionTitle'
import { PixelMountains } from '../components/PixelMountains'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { type Service, type ServiceId } from '../data/site'
import { useI18n } from '../i18n'

export default function About() {
  // the area under the pointer or focus, shared by the paragraph and the hub
  const [activeArea, setActiveArea] = useState<ServiceId | null>(null)
  const { t, servicePath, serviceById } = useI18n()
  const { about } = t
  return (
    <>
      <AboutHero />

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
                      to={servicePath(serviceById(part.area)!)}
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
function AreasHub({ active, onActive }: { active: ServiceId | null; onActive: (id: ServiceId | null) => void }) {
  const reduce = useReducedMotion()
  const { t, servicePath } = useI18n()
  // the six areas the paragraph names, in its order
  const areas = t.about.whatParts.flatMap((part) =>
    typeof part === 'string' ? [] : t.services.filter((s): s is Service => s.id === part.area),
  )
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
              <g key={`${side}-${i}`} className={active === service.id ? 'is-active' : undefined}>
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
        <DSymbol className="hub__mark" />
      </div>

      {sides.map((list, side) =>
        list.map((service, i) => (
          <Reveal
            key={service.id}
            className={`hub__node hub__node--${side === 0 ? 'left' : 'right'}${active === service.id ? ' is-active' : ''}`}
            style={{ ['--y' as string]: `${(HUB.rows[i] / HUB.h) * 100}%`, ['--i' as string]: side * 3 + i }}
            delay={0.35 + i * 0.1 + side * 0.05}
            y={12}
          >
            <Link
              to={servicePath(service)}
              className="hub__link"
              onPointerEnter={() => onActive(service.id)}
              onPointerLeave={() => onActive(null)}
              onFocus={() => onActive(service.id)}
              onBlur={() => onActive(null)}
            >
              <span className="chip">
                <ServiceIcon name={service.icon} width={20} height={20} />
              </span>
              <span className="hub__label">{service.name}</span>
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

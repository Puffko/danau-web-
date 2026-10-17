import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CtaBand } from '../components/CtaBand'
import { ArrowRight, ServiceIcon } from '../components/Icons'
import { PixelGlyph } from '../components/PixelGlyph'
import { PageHero } from '../components/PageHero'
import { PixelCluster } from '../components/PixelCluster'
import { PixelMountains } from '../components/PixelMountains'
import { useHover } from '../hooks/useHover'
import { Reveal } from '../components/Reveal'
import { EASE_IO, EASE_OUT } from '../lib/motion'
import { SectionTitle } from '../components/SectionTitle'
import { ServiceCard } from '../components/ServiceCard'
import type { Service as ServiceData, ServiceDetailBlock } from '../data/site'
import { serviceBySlug, useI18n } from '../i18n'
import NotFound from './NotFound'

/**
 * A service page reads as one assembled field: the night hero, the opening paragraph inked in
 * as it is read, then the list of what DANAU provides as a night band where each item's pixel
 * ignites, then how the work is done, the call to act and the other services.
 */
export default function Service() {
  const { slug } = useParams()
  const { lang, t, serviceById } = useI18n()
  const service = serviceBySlug(lang, slug)
  if (!service) return <NotFound />

  const index = t.services.indexOf(service)
  const others = t.services.filter((s) => s !== service)

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

      {service.blocks.map((block, i) => (
        <Block
          key={i}
          block={block}
          first={i === 0}
          service={service}
          seed={index * 5 + i}
          linked={block.kind === 'link' ? serviceById(block.service) : undefined}
        />
      ))}

      <CtaBand title={service.ctaTitle} seed={index * 3 + 2} />

      <section className="section section--tight related">
        <div className="container">
          <SectionTitle className="display-3 section-title--center" text={t.ui.moreServices} />
          <ul className="related__grid">
            {others.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 0.05}>
                <ServiceCard service={s} compact seed={i * 5} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

function Block({
  block,
  first,
  service,
  seed,
  linked,
}: {
  block: ServiceDetailBlock
  first: boolean
  service: ServiceData
  seed: number
  /** The service a link block points to; the card carries its name. */
  linked?: ServiceData
}) {
  const { servicePath } = useI18n()
  if (block.kind === 'link') {
    return (
      <section className="section section--tight svc-link">
        <div className="container">
          <Reveal>
            <LinkCard to={servicePath(linked!)} title={linked!.name} body={block.body} />
          </Reveal>
        </div>
      </section>
    )
  }
  return (
    <>
      {first ? (
        <Intro title={block.title} body={block.body} service={service} />
      ) : (
        <Approach title={block.title} body={block.body} />
      )}
      {block.list && <Provided title={block.listTitle ?? ''} items={block.list} seed={seed} />}
    </>
  )
}

/** The opening paragraph, large, inking word by word from pale to ink as it is read. */
function Intro({ title, body, service }: { title: string; body: string; service: ServiceData }) {
  return (
    <section className="section svc-intro">
      <div className="container svc-intro__grid">
        <div className="svc-intro__head">
          <Reveal y={10}>
            <span className="chip svc-intro__chip">
              <ServiceIcon name={service.icon} width={22} height={22} />
            </span>
          </Reveal>
          <SectionTitle as="h2" className="svc-intro__title" text={title} />
        </div>
        <InkedText className="svc-intro__statement" text={body} />
      </div>
    </section>
  )
}

function InkedText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'end 0.6'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <InkWord
          key={i}
          progress={scrollYProgress}
          from={i / words.length}
          to={(i + 1) / words.length}
          still={Boolean(reduce)}
          last={i === words.length - 1}
        >
          {word}
        </InkWord>
      ))}
    </p>
  )
}

function InkWord({
  progress,
  from,
  to,
  still,
  last,
  children,
}: {
  progress: MotionValue<number>
  from: number
  to: number
  still: boolean
  last: boolean
  children: string
}) {
  // starts at half ink: still a visible change as it is read, and 3.5:1 against white before it
  const opacity = useTransform(progress, [from, to], [0.5, 1])
  return (
    <>
      <motion.span style={still ? undefined : { opacity }}>{children}</motion.span>
      {last ? null : ' '}
    </>
  )
}

/** What DANAU provides: a night band, each item a line whose pixel ignites as it arrives. */
function Provided({ title, items, seed }: { title: string; items: string[]; seed: number }) {
  const reduce = useReducedMotion()
  const id = `provided-${seed}`
  return (
    <section className="svc-list" data-theme="dark" data-pixel-host aria-labelledby={id}>
      <div className="hero-glow svc-list__glow" aria-hidden="true" />
      <PixelMountains className="svc-list__mountains" variant="low" seed={seed + 30} />
      <div className="container">
        <SectionTitle id={id} className="display-2 section-title--center svc-list__title" text={title} tone="light" />
        <ul className="svc-list__items" style={{ ['--cols' as string]: items.length > 4 ? 3 : 2 }}>
          {items.map((item, i) => (
            <motion.li
              key={item}
              className="svc-list__item"
              initial="rest"
              whileInView="lit"
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ delayChildren: reduce ? 0 : 0.1 + i * 0.09 }}
            >
              <motion.span
                className="svc-list__pixel"
                aria-hidden="true"
                variants={{ rest: { scale: 0.4, opacity: 0.25 }, lit: { scale: 1, opacity: 1 } }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
              />
              <motion.span
                className="svc-list__text"
                variants={
                  reduce
                    ? { rest: { opacity: 1 }, lit: { opacity: 1 } }
                    : { rest: { opacity: 0.4, y: 14 }, lit: { opacity: 1, y: 0 } }
                }
                transition={{ duration: 1, ease: EASE_OUT }}
              >
                {item}
              </motion.span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * How the work is done: the paragraph's sentences as a path of steps, each on a pixel node,
 * joined by a line that draws down as the reader reaches it.
 */
function Approach({ title, body }: { title: string; body: string }) {
  const reduce = useReducedMotion()
  const steps = body.split(/(?<=[.!?])\s+(?=\p{Lu})/u)
  return (
    <section className="section svc-approach">
      <div className="container svc-approach__grid">
        <SectionTitle as="h2" className="svc-approach__title" text={title} />
        <ol className="svc-path">
          {steps.map((step, i) => (
            <motion.li
              key={i}
              className="svc-path__step"
              initial="rest"
              whileInView="lit"
              viewport={{ once: true, margin: '0px 0px -18% 0px' }}
            >
              <motion.span
                className="svc-path__node"
                aria-hidden="true"
                variants={{ rest: { scale: 0.45, opacity: 0.3 }, lit: { scale: 1, opacity: 1 } }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
              />
              {i < steps.length - 1 && (
                <motion.span
                  className="svc-path__line"
                  aria-hidden="true"
                  variants={{ rest: { scaleY: reduce ? 1 : 0 }, lit: { scaleY: 1 } }}
                  transition={{ duration: 1.1, delay: 0.25, ease: EASE_IO }}
                />
              )}
              <motion.p
                className="svc-path__text"
                variants={
                  reduce
                    ? { rest: { opacity: 1 }, lit: { opacity: 1 } }
                    : { rest: { opacity: 0.75, y: 12 }, lit: { opacity: 1, y: 0 } }
                }
                transition={{ duration: 0.9, delay: 0.08, ease: EASE_OUT }}
              >
                {step}
              </motion.p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
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

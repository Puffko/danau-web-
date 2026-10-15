import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from '../components/Icons'
import { PixelMountains } from '../components/PixelMountains'
import { EASE_OUT, Reveal, RevealText } from '../components/Reveal'
import { PixelCluster } from '../components/PixelCluster'
import { SphereDiagram } from '../components/SphereDiagram'
import { useHover } from '../hooks/useHover'
import { SectionTitle } from '../components/SectionTitle'
import { ServiceCard } from '../components/ServiceCard'
import { home, routes, services } from '../data/site'
import { scrollToTarget, useLenis } from '../hooks/smoothScroll'

function Hero() {
  const lenis = useLenis()
  return (
    <section className="hero" data-pixel-host data-theme="dark">
      <div className="hero-glow" aria-hidden="true" />
      <PixelMountains className="hero__mountains" variant="hero" seed={3} />
      <div className="container hero__inner">
        <RevealText
          as="h1"
          immediate
          className="hero__title"
          text={home.hero.title}
          delay={0.2}
          stagger={0.05}
          shine="light"
        />
        <div className="hero__aside">
          {/* the lead's words follow the headline in, then the buttons */}
          <RevealText as="p" immediate className="hero__text" text={home.hero.text} delay={0.7} stagger={0.014} />
          <Reveal immediate delay={1.25} className="hero__actions">
            <Link to={routes.contact} className="btn btn--pill btn--light">
              <span>{home.hero.primary}</span>
              <ArrowUpRight />
            </Link>
            <a
              href="#sluzby"
              className="btn btn--pill btn--ghost"
              onClick={(e) => {
                const target = document.getElementById('sluzby')
                if (!target) return
                e.preventDefault()
                scrollToTarget(lenis, target)
                target.focus({ preventScroll: true })
              }}
            >
              <span>{home.hero.secondary}</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Partner() {
  const { partner } = home
  return (
    <section id="o-nas" className="section partner" aria-labelledby="partner-title">
      <div className="container">
        <SectionTitle id="partner-title" className="display-2 process__title" text={partner.title} />
        <SphereDiagram
          mirrored
          resultLast
          seed={17}
          notes={[
            { label: partner.labels.lead, text: partner.lead },
            { label: partner.labels.approach, text: partner.approach },
          ]}
          result={{
            title: partner.labels.outcome,
            text: partner.outcome,
            extra: (
              <Link to={routes.about} className="process-orb__link">
                <span>O nás</span>
                <ArrowRight />
              </Link>
            ),
          }}
        />
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="sluzby" className="section services" tabIndex={-1}>
      <div className="container">
        <SectionTitle className="display-2 section-title--center" text={home.services.title} />
        <ul className="service-grid">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 3) * 0.08} className="service-grid__item">
              <ServiceCard service={s} moreLabel={home.services.more} seed={i * 7} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Process() {
  const [challenge, solution, goal] = home.process.paragraphs
  return (
    <section className="section process" aria-labelledby="process-title">
      <div className="container">
        <SectionTitle id="process-title" className="display-2 process__title" text={home.process.title} />
        <SphereDiagram
          resultLast
          notes={[
            { label: 'Výzva', text: challenge },
            { label: 'Cieľ', text: goal },
          ]}
          result={{ title: 'Riešenie', text: solution }}
        />
      </div>
    </section>
  )
}

function Expertise() {
  const { expertise } = home
  return (
    <section className="section expertise" aria-labelledby="expertise-title">
      <div className="container expertise__grid">
        <div className="expertise__intro">
          <SectionTitle id="expertise-title" className="display-2" text={expertise.title} />
          <Reveal>
            <p className="lead">{expertise.lead}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="body-copy">{expertise.listIntro}</p>
          </Reveal>
        </div>
        <ul className="domains">
          {expertise.domains.map((d, i) => (
            <DomainCell key={d.area} seed={i * 6}>
              <span className="domains__area">{d.area}</span>
              <span className="domains__certs">
                {d.certs.map((c) => (
                  <span key={c} className="domains__cert">
                    {c}
                  </span>
                ))}
              </span>
            </DomainCell>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Clients() {
  const ref = useRef<HTMLElement>(null)
  const lenis = useLenis()
  const items = home.clients.items
  const [active, setActive] = useState(0)
  const [isStatic, setIsStatic] = useState(false)
  const innerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // The pinned, scroll-driven list only works when the whole panel fits on screen; small,
  // short or text-spaced viewports get a plain list with every description visible.
  const staticRef = useRef(false)
  staticRef.current = isStatic

  useEffect(() => {
    const inner = innerRef.current
    if (!inner) return
    const mq = window.matchMedia('(max-width: 960px), (max-height: 640px)')
    // Height the pinned layout needed the last time it was measured. The static layout wraps
    // differently, so measuring it would flip the mode back and forth every frame.
    let pinnedNeed = 0
    // Measure only what the pinned layout shows (title and names), so the decision does not
    // depend on the descriptions the static layout adds.
    const needed = () => {
      const title = inner.querySelector<HTMLElement>('.clients__title')?.offsetHeight ?? 0
      const names = [...inner.querySelectorAll<HTMLElement>('.clients__name')].reduce((h, el) => h + el.offsetHeight, 0)
      return title + names + 260
    }
    const update = () => {
      if (mq.matches) return setIsStatic(true)
      if (!staticRef.current) {
        pinnedNeed = needed()
        setIsStatic(pinnedNeed > window.innerHeight)
      } else if (pinnedNeed && pinnedNeed <= window.innerHeight) {
        setIsStatic(false) // re-measured in the pinned layout on the next observer callback
      } else if (!pinnedNeed) {
        setIsStatic(false)
      }
    }
    update()
    // content changes (fonts, user text spacing) only matter while pinned
    const ro = new ResizeObserver(() => {
      if (!staticRef.current) update()
    })
    ro.observe(inner)
    mq.addEventListener('change', update)
    window.addEventListener('resize', update)
    document.fonts?.ready.then(() => !staticRef.current && update())
    return () => {
      ro.disconnect()
      mq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActive(Math.min(items.length - 1, Math.max(0, Math.floor(p * items.length * 0.999))))
  })

  const jumpTo = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const travel = el.offsetHeight - window.innerHeight
    scrollToTarget(lenis, top + (travel * (i + 0.5)) / items.length)
  }

  return (
    <section
      ref={ref}
      className={`clients${isStatic ? ' is-static' : ''}`}
      data-theme="dark"
      style={{ ['--count' as string]: items.length }}
    >
      <div className="clients__sticky">
        <div className="clients__bg" aria-hidden="true" />
        <div className="container clients__inner" ref={innerRef}>
          <SectionTitle className="display-2 clients__title" text={home.clients.title} tone="light" />
          <div className="clients__stage">
            <ol className="clients__list">
              {items.map((item, i) => (
                <li key={item.title} className={i === active ? 'is-active' : undefined}>
                  <h3 className="clients__heading">
                    {isStatic ? (
                      <span className="clients__name">{item.title}</span>
                    ) : (
                      <button
                        type="button"
                        className="clients__name"
                        aria-current={i === active ? 'true' : undefined}
                        onClick={() => jumpTo(i)}
                      >
                        <span className="clients__pixel" aria-hidden="true" />
                        {item.title}
                      </button>
                    )}
                  </h3>
                  {/* Small screens read the list as a list, every description visible. */}
                  <p className="clients__text-inline">{item.text}</p>
                </li>
              ))}
            </ol>
            <div className="clients__detail" aria-live="polite" hidden={isStatic}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
              >
                <p className="clients__text">{items[active].text}</p>
              </motion.div>
              <div className="clients__progress" aria-hidden="true">
                {items.map((_, i) => (
                  <span key={i} className={i <= active ? 'is-on' : undefined} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Partner />
      <Services />
      <Process />
      <Expertise />
      <Clients />
    </>
  )
}

function DomainCell({ seed, children }: { seed: number; children: ReactNode }) {
  const [active, hover] = useHover()
  return (
    <li className="domains__cell" {...hover}>
      <PixelCluster className="tile-pixels" active={active} seed={seed} radius={84} cell={9} activeRamp="rest" />
      {children}
    </li>
  )
}

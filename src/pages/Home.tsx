import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, DSymbol } from '../components/Icons'
import { PixelMountains } from '../components/PixelMountains'
import { EASE_OUT, Reveal, RevealText } from '../components/Reveal'
import { SphereDiagram } from '../components/SphereDiagram'
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
        <RevealText as="h1" immediate className="hero__title" text={home.hero.title} delay={0.2} stagger={0.05} />
        <Reveal immediate delay={0.75} className="hero__aside">
          <p className="hero__text">{home.hero.text}</p>
          <div className="hero__actions">
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
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Partner() {
  const { partner } = home
  return (
    <section id="o-nas" className="section partner" aria-labelledby="partner-title">
      <div className="container">
        <RevealText as="h2" id="partner-title" className="display-2 process__title" text={partner.title} />
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
      <Partners />
    </section>
  )
}

// Neutral stand-in marks, varied so the row does not read as one tile repeated.
const PLACEHOLDER_MARKS = [
  <circle key="c" cx="12" cy="12" r="9" />,
  <rect key="r" x="3" y="3" width="18" height="18" rx="5" />,
  <path key="t" d="M12 3 21 20H3Z" />,
  <path key="h" d="M12 2.5 20.5 7.5v9L12 21.5 3.5 16.5v-9Z" />,
  <path key="d" d="M3 3h9a9 9 0 0 1 0 18H3Z" />,
  <path key="s" d="M12 2.5 14.6 9.4 21.5 12 14.6 14.6 12 21.5 9.4 14.6 2.5 12 9.4 9.4Z" />,
]

function Partners() {
  const { title, items } = home.partners
  return (
    <div className="container partners">
      <h3 className="partners__title">{title}</h3>
      <ul className="partners__grid">
        {items.map((p, i) => {
          const mark = p.logo ? (
            <img src={p.logo} alt={p.name} loading="lazy" />
          ) : (
            <span className="partners__placeholder">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {PLACEHOLDER_MARKS[i % PLACEHOLDER_MARKS.length]}
              </svg>
              <span aria-hidden="true">Logo</span>
              <span className="sr-only">{p.name} – logo bude doplnené</span>
            </span>
          )
          return (
            <Reveal as="li" key={p.name} delay={i * 0.06} y={16} className="partners__item">
              {p.href ? (
                <a href={p.href} target="_blank" rel="noreferrer" className="partners__tile">
                  {mark}
                </a>
              ) : (
                <div className="partners__tile">{mark}</div>
              )}
            </Reveal>
          )
        })}
      </ul>
    </div>
  )
}

function Services() {
  return (
    <section id="sluzby" className="section services" tabIndex={-1}>
      <div className="container">
        <RevealText as="h2" className="display-2 section-title--center" text={home.services.title} />
        <ul className="service-grid">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 3) * 0.08} className="service-grid__item">
              <ServiceCard service={s} moreLabel={home.services.more} />
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
        <RevealText as="h2" id="process-title" className="display-2 process__title" text={home.process.title} />
        <SphereDiagram
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
  const certs = home.expertise.items
  return (
    <section className="section expertise">
      <div className="container split">
        <div className="split__head">
          <RevealText as="h2" className="display-2" text={home.expertise.title} />
        </div>
        <div className="split__body">
          <Reveal>
            <p className="lead">{home.expertise.lead}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="body-copy">{home.expertise.listIntro}</p>
          </Reveal>
        </div>
      </div>

      <div className="container">
        <ul className="certs">
          {certs.map((c) => (
            <li key={c} className={`certs__item${c.length > 14 ? ' certs__item--wide' : ''}`}>
              <DSymbol className="certs__mark" />
              <span className="certs__name">{c}</span>
            </li>
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
          <RevealText as="h2" className="display-2 clients__title" text={home.clients.title} />
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

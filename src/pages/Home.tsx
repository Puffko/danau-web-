import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, DSymbol, Pause, Play } from '../components/Icons'
import { PixelMountains } from '../components/PixelMountains'
import { EASE_OUT, Reveal, RevealText } from '../components/Reveal'
import { PixelSphere } from '../components/PixelSphere'
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
  return (
    <section id="o-nas" className="section partner">
      <div className="container split">
        <div className="split__head">
          <RevealText as="h2" className="display-2" text={home.partner.title} />
        </div>
        <div className="split__body">
          <Reveal>
            <p className="lead">{home.partner.lead}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="body-copy">{home.partner.body}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link to={routes.about} className="text-link">
              <span>O nás</span>
              <ArrowRight />
            </Link>
          </Reveal>
        </div>
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

// Geometry of the diagram, in the stage's viewBox units (1200 x 720).
const STAGE = { w: 1200, h: 720, cx: 880, cy: 360, r: 300, arc: 350 }
const NODES = [
  { y: 196, label: 'Výzva' },
  { y: 528, label: 'Cieľ' },
]
const arcX = (y: number) => STAGE.cx - Math.sqrt(STAGE.arc ** 2 - (y - STAGE.cy) ** 2)

function Process() {
  const reduce = useReducedMotion()
  const [challenge, solution, goal] = home.process.paragraphs
  const notes = [challenge, goal]
  const draw = (delay: number, duration = 1.4) => ({
    initial: { pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: '0px 0px -20% 0px' },
    transition: { duration, delay, ease: [0.65, 0, 0.35, 1] as const },
  })
  const arcTop = STAGE.cy - STAGE.arc
  const arcBottom = STAGE.cy + STAGE.arc

  return (
    <section className="section process" aria-labelledby="process-title">
      <div className="container">
        <RevealText as="h2" id="process-title" className="display-2 process__title" text={home.process.title} />

        <div className="process-stage">
          <svg className="process-stage__lines" viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} aria-hidden="true">
            <defs>
              <linearGradient id="arc-fade" x1="0" y1={arcTop} x2="0" y2={arcBottom} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#1818ec" stopOpacity="0" />
                <stop offset="0.22" stopColor="#1818ec" stopOpacity="0.7" />
                <stop offset="0.78" stopColor="#1818ec" stopOpacity="0.7" />
                <stop offset="1" stopColor="#1818ec" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={`M ${STAGE.cx} ${arcTop} A ${STAGE.arc} ${STAGE.arc} 0 0 0 ${STAGE.cx} ${arcBottom}`}
              fill="none"
              stroke="url(#arc-fade)"
              strokeWidth="1.2"
              {...draw(0.1, 1.8)}
            />
            {NODES.map((n, i) => (
              <g key={n.label}>
                <motion.path
                  d={`M 250 ${n.y} H ${arcX(n.y)}`}
                  stroke="#1818ec"
                  strokeOpacity="0.45"
                  strokeWidth="1.2"
                  {...draw(0.7 + i * 0.25, 0.9)}
                />
                <motion.circle
                  cx={arcX(n.y)}
                  cy={n.y}
                  r="6"
                  fill="#1818ec"
                  initial={{ scale: reduce ? 1 : 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                  transition={{ delay: 1.2 + i * 0.25, duration: 0.6, ease: EASE_OUT }}
                  style={{ transformOrigin: `${arcX(n.y)}px ${n.y}px`, transformBox: 'view-box' }}
                />
                <circle className="process-stage__ping" cx={arcX(n.y)} cy={n.y} r="6" fill="none" stroke="#1818ec" style={{ animationDelay: `${i * 1.3}s` }} />
              </g>
            ))}
          </svg>

          {NODES.map((n, i) => (
            <Reveal
              key={n.label}
              className={`process-note process-note--${i + 1}`}
              delay={0.5 + i * 0.25}
              style={{ ['--y' as string]: `${(n.y / STAGE.h) * 100}%` }}
            >
              <span className="process-note__pill">{n.label}</span>
              <p className="process-note__text">{notes[i]}</p>
            </Reveal>
          ))}

          <div
            className="process-orb"
            style={{
              ['--cx' as string]: `${(STAGE.cx / STAGE.w) * 100}%`,
              ['--cy' as string]: `${(STAGE.cy / STAGE.h) * 100}%`,
              ['--d' as string]: `${((STAGE.r * 2) / STAGE.w) * 100}%`,
            }}
          >
            <PixelSphere className="process-orb__sphere" />
            <Reveal className="process-orb__solution" delay={0.9}>
              <h3 className="process-orb__title">Riešenie</h3>
              <p className="process-orb__text">{solution}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Expertise() {
  const certs = home.expertise.items
  const [paused, setPaused] = useState(false)
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

      <ul className="sr-only">
        {certs.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <div className={`marquee${paused ? ' is-paused' : ''}`}>
        <button
          type="button"
          className="marquee__toggle"
          aria-pressed={paused}
          aria-label="Pozastaviť posúvanie certifikácií"
          onClick={() => setPaused((v) => !v)}
        >
          {paused ? <Play /> : <Pause />}
        </button>
        <div className="marquee__track" aria-hidden="true">
          {[0, 1].map((copy) => (
            <div className="marquee__group" key={copy}>
              {certs.map((c) => (
                <span className="marquee__item" key={c}>
                  <span className="marquee__text">{c}</span>
                  <DSymbol className="marquee__sep" />
                </span>
              ))}
            </div>
          ))}
        </div>
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

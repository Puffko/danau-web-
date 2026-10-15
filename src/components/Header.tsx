import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useId, useRef, useState, type FocusEvent, type PointerEvent } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { contact, home, routes, services } from '../data/site'
import { useLenis } from '../hooks/smoothScroll'
import { ArrowRight, ArrowUpRight, Caret, Close, Menu, ServiceIcon } from './Icons'
import { Wordmark } from './Logo'
import { PixelCluster } from './PixelCluster'
import { EASE_OUT } from './Reveal'

const DESKTOP_NAV = '(min-width: 1101px)'

export function Header() {
  const location = useLocation()
  const lenis = useLenis()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeTimer = useRef<number>()
  const openedByHover = useRef(false)
  const panelId = useId()
  const headerRef = useRef<HTMLElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const servicesButtonRef = useRef<HTMLButtonElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // The bar always stays in view; past the hero it turns solid.
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  // Close menus on every navigation, including links to the page already showing.
  useEffect(() => {
    setServicesOpen(false)
    setMobileOpen(false)
  }, [location.key])

  useEffect(() => {
    if (!servicesOpen) openedByHover.current = false
  }, [servicesOpen])

  // Mobile menu: lock the page behind it and take it out of the tab order.
  useEffect(() => {
    if (mobileOpen) lenis?.stop()
    else lenis?.start()
    document.documentElement.classList.toggle('is-locked', mobileOpen)
    document.getElementById('page')?.toggleAttribute('inert', mobileOpen)
  }, [mobileOpen, lenis])

  // The hamburger disappears above the mobile breakpoint, so the menu must not outlive it.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_NAV)
    const onChange = () => mq.matches && setMobileOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!servicesOpen && !mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (servicesOpen) {
        setServicesOpen(false)
        servicesButtonRef.current?.focus()
      }
      if (mobileOpen) {
        setMobileOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setServicesOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [servicesOpen, mobileOpen])

  // Hover opens the panel for mouse pointers only; touch and pen rely on the click.
  const onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    window.clearTimeout(closeTimer.current)
    if (!servicesOpen) openedByHover.current = true
    setServicesOpen(true)
  }
  const onPointerLeave = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 160)
  }
  const onServicesClick = () => {
    // Clicking a panel that hover already opened means "I want this menu", not "close it".
    if (openedByHover.current) {
      openedByHover.current = false
      setServicesOpen(true)
      return
    }
    openedByHover.current = false
    setServicesOpen((v) => !v)
  }
  const onDropdownBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setServicesOpen(false)
  }

  const onServicesPage = location.pathname.startsWith('/sluzby')

  return (
    <>
      {!mobileOpen && (
        <a className="skip-link" href="#obsah">
          Preskočiť na obsah
        </a>
      )}
      <motion.header
        ref={headerRef}
        className={`site-header${scrolled && !mobileOpen ? ' is-solid' : ''}${mobileOpen ? ' is-menu-open' : ''}`}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
      >
        <div className="site-header__inner container">
          <Link to="/" className="brand" aria-label="Danau – domov">
            <Wordmark className="brand__mark" aria-hidden="true" />
          </Link>

          <nav className="primary-nav" aria-label="Hlavná navigácia">
            <NavLink to="/" end className="primary-nav__link">
              Domov
            </NavLink>
            <div
              className="nav-dropdown"
              ref={dropdownRef}
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
              onBlur={onDropdownBlur}
            >
              <button
                ref={servicesButtonRef}
                type="button"
                className={`primary-nav__link${onServicesPage ? ' active' : ''}`}
                aria-expanded={servicesOpen}
                aria-controls={panelId}
                onClick={onServicesClick}
              >
                Služby
                <Caret className={`caret${servicesOpen ? ' is-open' : ''}`} />
              </button>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    id={panelId}
                    className="nav-dropdown__panel"
                    initial={{ opacity: 0, y: -10, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.985, transition: { duration: 0.18 } }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                  >
                    <Link to={routes.services} className="nav-dropdown__feature">
                      <PixelCluster className="nav-dropdown__pixels" active seed={5} radius={150} cell={10} />
                      <span className="nav-dropdown__feature-title">{home.services.title}</span>
                      <span className="nav-dropdown__feature-cta">
                        <span>Všetky služby</span>
                        <ArrowRight />
                      </span>
                    </Link>
                    <ul className="nav-dropdown__grid">
                      {services.map((s, i) => (
                        <motion.li
                          key={s.slug}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.04 * i + 0.06, duration: 0.5, ease: EASE_OUT }}
                        >
                          <NavLink to={`/sluzby/${s.slug}`} className="nav-dropdown__item">
                            <span className="chip chip--sm">
                              <ServiceIcon name={s.icon} width={18} height={18} />
                            </span>
                            <span className="nav-dropdown__label">{s.navLabel}</span>
                            <ArrowRight className="nav-dropdown__arrow" />
                          </NavLink>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <NavLink to={routes.about} className="primary-nav__link">
              O nás
            </NavLink>
            <NavLink to={routes.contact} className="primary-nav__link">
              Kontakt
            </NavLink>
          </nav>

          <Link to={routes.contact} className="btn btn--pill btn--header">
            <span>Konzultovať potrebu</span>
            <ArrowUpRight />
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Zatvoriť hlavnú navigáciu' : 'Otvoriť hlavnú navigáciu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <Close /> : <Menu />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            data-lenis-prevent
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.35, ease: EASE_OUT } }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <nav className="mobile-menu__nav container" aria-label="Mobilná navigácia">
              {[
                { to: '/', label: 'Domov' },
                { to: routes.services, label: 'Služby' },
                { to: routes.about, label: 'O nás' },
                { to: routes.contact, label: 'Kontakt' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: EASE_OUT }}
                >
                  <Link to={item.to} className="mobile-menu__link">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.ul
                className="mobile-menu__services"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/sluzby/${s.slug}`}>
                      <ServiceIcon name={s.icon} width={16} height={16} />
                      {s.navLabel}
                    </Link>
                  </li>
                ))}
              </motion.ul>
              <motion.div
                className="mobile-menu__foot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Link to={routes.contact} className="btn btn--pill btn--light mobile-menu__cta">
                  <span>Konzultovať potrebu</span>
                  <ArrowUpRight />
                </Link>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                <a href={contact.phoneHref}>{contact.phone}</a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { contact, footer, routes, services } from '../data/site'
import { ArrowUpRight, Mail, Phone, Pin } from './Icons'
import { Wordmark, WordmarkShapes } from './Logo'
import { EASE_OUT, RevealText } from './Reveal'

export function Footer() {
  const reduce = useReducedMotion()

  return (
    <footer id="kontakt" className="site-footer" data-theme="dark">
      <div className="site-footer__glow" aria-hidden="true" />
      <div className="container site-footer__top">
        <div className="site-footer__claim">
          <Link to="/" className="site-footer__brand" aria-label="Danau – domov">
            <Wordmark aria-hidden="true" />
          </Link>
          <RevealText as="p" className="site-footer__headline" text={footer.claim} />
          <Link to={routes.contact} className="btn btn--pill btn--light">
            <span>Konzultovať potrebu</span>
            <ArrowUpRight />
          </Link>
        </div>

        <div className="site-footer__cols">
          <div>
            <h2 className="site-footer__title">{footer.servicesTitle}</h2>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/sluzby/${s.slug}`}>{s.navLabel}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="site-footer__title">{footer.linksTitle}</h2>
            <ul>
              <li>
                <Link to="/">Domov</Link>
              </li>
              <li>
                <Link to={routes.about}>O nás</Link>
              </li>
              <li>
                <Link to={routes.contact}>Kontakt</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="site-footer__title">{footer.contactTitle}</h2>
            <ul className="site-footer__contact">
              <li>
                <Mail width={16} height={16} />
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li>
                <Phone width={16} height={16} />
                <a href={contact.phoneHref}>{contact.phone}</a>
              </li>
              <li>
                <Pin width={16} height={16} />
                <a href={contact.mapsHref} target="_blank" rel="noreferrer">
                  {contact.street}
                  <br />
                  {contact.city}
                  <br />
                  {contact.country}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>{footer.copyright}</p>
        <div className="site-footer__legal">
          <Link to={routes.privacy}>Ochrana osobných údajov</Link>
          <Link to={routes.cookies}>Cookies</Link>
        </div>
      </div>

      <div className="site-footer__mark" aria-hidden="true">
        <motion.div
          initial={reduce ? { opacity: 0 } : { y: '45%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.1, ease: EASE_OUT }}
        >
          <svg className="site-footer__wordmark" viewBox="0 0 134 42.138">
            <defs>
              <pattern id="footer-dots" width="0.9" height="0.9" patternUnits="userSpaceOnUse">
                <rect x="0.1" y="0.1" width="0.7" height="0.7" fill="#fff" />
              </pattern>
              <mask id="footer-mark-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="134" height="42.138">
                <WordmarkShapes paint="url(#footer-dots)" />
              </mask>
              <linearGradient id="footer-mark-fill" x1="0" y1="0" x2="0" y2="42.138" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.55" stopColor="#eef1ff" />
                <stop offset="1" stopColor="#c9d3ff" />
              </linearGradient>
            </defs>
            <rect width="134" height="42.138" fill="url(#footer-mark-fill)" mask="url(#footer-mark-mask)" />
          </svg>
        </motion.div>
      </div>
    </footer>
  )
}

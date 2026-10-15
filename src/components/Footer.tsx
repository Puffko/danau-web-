import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { contact, footer, routes, services } from '../data/site'
import { ArrowUpRight, Mail, Phone, Pin } from './Icons'
import { Wordmark } from './Logo'
import { PixelWordmark } from './PixelWordmark'
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
            <span>Kontakt</span>
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
          <PixelWordmark className="site-footer__wordmark" />
        </motion.div>
      </div>
    </footer>
  )
}

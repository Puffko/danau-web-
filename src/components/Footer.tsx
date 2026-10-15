import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { contact } from '../data/site'
import { useI18n } from '../i18n'
import { ArrowUpRight, Mail, Phone, Pin } from './Icons'
import { PixelWordmark } from './PixelWordmark'
import { EASE_OUT, RevealText } from './Reveal'

export function Footer() {
  const reduce = useReducedMotion()
  const { t, paths, servicePath } = useI18n()
  const { footer } = t

  return (
    <footer id="kontakt" className="site-footer" data-theme="dark">
      <div className="site-footer__glow" aria-hidden="true" />
      <div className="container site-footer__top">
        <div className="site-footer__claim">
          <RevealText as="p" className="site-footer__headline" text={footer.claim} />
          <Link to={paths.contact} className="btn btn--pill btn--light">
            <span>{t.ui.nav.contact}</span>
            <ArrowUpRight />
          </Link>
        </div>

        <div className="site-footer__cols">
          <div>
            <h2 className="site-footer__title">{footer.servicesTitle}</h2>
            <ul>
              {t.services.map((s) => (
                <li key={s.id}>
                  <Link to={servicePath(s)}>{s.navLabel}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="site-footer__title">{footer.linksTitle}</h2>
            <ul>
              <li>
                <Link to={paths.home}>{t.ui.nav.home}</Link>
              </li>
              <li>
                <Link to={paths.about}>{t.ui.nav.about}</Link>
              </li>
              <li>
                <Link to={paths.contact}>{t.ui.nav.contact}</Link>
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
                  {t.ui.country}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>{footer.copyright}</p>
        <div className="site-footer__legal">
          <Link to={paths.privacy}>{t.privacy.title}</Link>
          <Link to={paths.cookies}>{t.cookies.title}</Link>
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

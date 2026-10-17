import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { OPEN_EVENT, setConsent, storedConsent, type Consent } from '../lib/consent'
import { EASE_OUT } from '../lib/motion'

/**
 * The cookie bar: a small night card at the foot of the screen, shown until the visitor accepts or
 * rejects analytics cookies, and again from the footer's "Cookie settings". It waits for the
 * first-load screen to finish, so it never covers the intro.
 */
export function CookieBar({ ready }: { ready: boolean }) {
  const { t, paths } = useI18n()
  const copy = t.ui.cookieBar
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!ready || storedConsent() !== null) return
    const id = window.setTimeout(() => setOpen(true), 700)
    return () => window.clearTimeout(id)
  }, [ready])

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_EVENT, onOpen)
  }, [])

  const choose = (value: Consent) => {
    setConsent(value)
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          className="cookie-bar"
          role="region"
          aria-label={copy.label}
          data-theme="dark"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, transition: { duration: 0.3 } }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <p className="cookie-bar__text">
            {copy.text} <Link to={paths.cookies}>{copy.more}</Link>
          </p>
          {/* both choices carry the same weight: rejecting is as easy as accepting */}
          <div className="cookie-bar__actions">
            <button type="button" className="btn btn--light cookie-bar__btn" onClick={() => choose('denied')}>
              {copy.reject}
            </button>
            <button type="button" className="btn btn--light cookie-bar__btn" onClick={() => choose('granted')}>
              {copy.accept}
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

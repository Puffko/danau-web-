import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, Check, Mail, Phone, Pin } from '../components/Icons'
import { PageHero } from '../components/PageHero'
import { EASE_OUT, Reveal, RevealText } from '../components/Reveal'
import { contact, contactPage, routes } from '../data/site'
import { scrollToTarget, useLenis } from '../hooks/smoothScroll'

interface FormState {
  fullName: string
  organization: string
  email: string
  phone: string
  message: string
  consent: boolean
}

const EMPTY: FormState = { fullName: '', organization: '', email: '', phone: '', message: '', consent: false }

type Errors = Partial<Record<keyof FormState, string>>

function validate(f: FormState): Errors {
  const e: Errors = {}
  if (!f.fullName.trim()) e.fullName = 'Vyplňte meno a priezvisko.'
  if (!f.email.trim()) e.email = 'Vyplňte e-mail, aby sme vám mohli odpovedať.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'E-mail nemá správny tvar, napr. meno@firma.sk.'
  if (!f.message.trim()) e.message = 'Napíšte, s čím vám môžeme pomôcť.'
  if (!f.consent) e.consent = 'Bez súhlasu vás nemôžeme kontaktovať.'
  return e
}

export default function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [failure, setFailure] = useState('')
  const statusRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  // Once the request settles, take keyboard and screen-reader users to the outcome.
  useEffect(() => {
    const el = statusRef.current
    if (!el || !(success || failure)) return
    el.focus({ preventScroll: true })
    const r = el.getBoundingClientRect()
    if (r.bottom > window.innerHeight || r.top < 0) scrollToTarget(lenis, el)
  }, [success, failure, lenis])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    if (sending) return
    setSuccess('')
    setFailure('')
    const found = validate(form)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`contact-${first}`)?.focus()
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; error?: string }
      if (!res.ok || !data.ok) {
        setFailure(data.error ?? contactPage.failure)
        return
      }
      setSuccess(data.message ?? contactPage.success)
      setForm(EMPTY)
    } catch {
      setFailure(contactPage.failure)
    } finally {
      setSending(false)
    }
  }

  const field = (key: 'fullName' | 'organization' | 'email' | 'phone', label: string, type: string, placeholder: string, required = false, autoComplete?: string) => (
    <div className={`field${errors[key] ? ' has-error' : ''}`}>
      <label htmlFor={`contact-${key}`}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={`contact-${key}`}
        name={key}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={form[key]}
        required={required}
        aria-invalid={errors[key] ? true : undefined}
        aria-describedby={errors[key] ? `contact-${key}-error` : undefined}
        onChange={(e) => set(key, e.target.value)}
      />
      {errors[key] && (
        <p className="field__error" id={`contact-${key}-error`}>
          {errors[key]}
        </p>
      )}
    </div>
  )

  return (
    <>
      <PageHero title={contactPage.title} text={contactPage.text} seed={13} />

      <section className="section contact">
        <div className="container contact__grid">
          <div className="contact__info">
            <Reveal>
              <a className="info-card info-card--main" href={contact.mapsHref} target="_blank" rel="noreferrer">
                <span className="info-card__label">
                  <Pin width={16} height={16} /> Sídlo spoločnosti
                </span>
                <h2 className="info-card__title">{contact.company}</h2>
                <p>{contact.street}</p>
                <p>{contact.city}</p>
                <p>{contact.country}</p>
                <span className="info-card__go" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </a>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="info-card">
                <span className="info-card__label">
                  <Mail width={16} height={16} /> E-mail
                </span>
                <a className="info-card__value" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="info-card">
                <span className="info-card__label">
                  <Phone width={16} height={16} /> Telefón
                </span>
                <a className="info-card__value" href={contact.phoneHref}>
                  {contact.phone}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="form-card">
            <RevealText as="h2" className="display-3" text={contactPage.formTitle} />
            <p className="contact-form__hint">Polia označené * sú povinné.</p>
            <form className="contact-form" noValidate onSubmit={onSubmit}>
              <div className="contact-form__row">
                {field('fullName', 'Meno a priezvisko', 'text', 'Zadajte vaše meno', true, 'name')}
                {field('organization', 'Organizácia', 'text', 'Názov vašej organizácie', false, 'organization')}
              </div>
              <div className="contact-form__row">
                {field('email', 'E-mail', 'email', 'vas@email.sk', true, 'email')}
                {field('phone', 'Telefón', 'tel', '+421', false, 'tel')}
              </div>
              <div className={`field${errors.message ? ' has-error' : ''}`}>
                <label htmlFor="contact-message">
                  Správa<span aria-hidden="true"> *</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  placeholder="Ako vám môžeme pomôcť?"
                  value={form.message}
                  required
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  onChange={(e) => set('message', e.target.value)}
                />
                {errors.message && (
                  <p className="field__error" id="contact-message-error">
                    {errors.message}
                  </p>
                )}
              </div>
              <div className={`consent${errors.consent ? ' has-error' : ''}`}>
                <input
                  id="contact-consent"
                  name="consent"
                  type="checkbox"
                  checked={form.consent}
                  aria-required="true"
                  aria-invalid={errors.consent ? true : undefined}
                  aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
                  onChange={(e) => set('consent', e.target.checked)}
                />
                <label htmlFor="contact-consent">
                  <span className="consent__box" aria-hidden="true">
                    <Check width={12} height={12} />
                  </span>
                  <span>
                    {contactPage.consent}
                    <span aria-hidden="true"> *</span>
                  </span>
                </label>
                <a className="consent__policy" href={routes.privacy} target="_blank" rel="noopener">
                  Ochrana osobných údajov
                  <span className="sr-only"> (otvorí sa v novom okne)</span>
                </a>
                {errors.consent && (
                  <p className="field__error" id="contact-consent-error">
                    {errors.consent}
                  </p>
                )}
              </div>
              <div className="contact-form__foot">
                <button type="submit" className="btn btn--pill btn--primary" aria-disabled={sending} aria-busy={sending}>
                  <span>{sending ? 'Odosielam…' : contactPage.submit}</span>
                  {sending ? <span className="spinner" aria-hidden="true" /> : <ArrowUpRight />}
                </button>
                <div aria-live="polite" className="contact-form__status" ref={statusRef} tabIndex={-1}>
                  <AnimatePresence mode="wait">
                    {success && (
                      <motion.p
                        key="ok"
                        className="notice notice--ok"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE_OUT }}
                      >
                        {success}
                      </motion.p>
                    )}
                    {failure && (
                      <motion.p
                        key="err"
                        className="notice notice--err"
                        role="alert"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE_OUT }}
                      >
                        {failure} Prípadne nám napíšte na <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  )
}

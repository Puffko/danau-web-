import { PageHero } from '../components/PageHero'
import { Reveal, RevealText } from '../components/Reveal'
import type { LegalPage } from '../data/site'
import { useI18n } from '../i18n'
import { OPEN_EVENT } from '../lib/consent'

export default function Legal({ page, seed }: { page: LegalPage; seed: number }) {
  const { t } = useI18n()
  return (
    <>
      <PageHero title={page.title} text={page.intro} seed={seed} size="sm" />
      <section className="section legal">
        <div className="container legal__inner">
          {page.sections.map((section) => (
            <article className="legal__section" key={section.title}>
              <RevealText as="h2" className="display-3" text={section.title} />
              <Reveal>
                {section.paragraphs.map((p) => (
                  <p className="body-copy" key={p}>
                    {p}
                  </p>
                ))}
                {section.list && (
                  <ul className="legal__list">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.cookies && (
                  <div className="cookie-register">
                    {section.cookies.groups.map((group) => (
                      <section className="cookie-register__group" key={group.title}>
                        <header className="cookie-register__head">
                          {/* filled pixel: always on; hollow pixel: only with consent */}
                          <span className={`cookie-register__mark${group.consent ? ' is-consent' : ''}`} aria-hidden />
                          <h3 className="cookie-register__title">{group.title}</h3>
                          <p className="cookie-register__note">{group.note}</p>
                        </header>
                        <ul>
                          {group.items.map((item) => (
                            <li className="cookie-item" key={item.name}>
                              <code className="cookie-item__name">{item.name}</code>
                              <div>
                                <p className="cookie-item__purpose">{item.purpose}</p>
                                <dl className="cookie-item__meta">
                                  <div>
                                    <dt>{section.cookies!.labels.provider}</dt>
                                    <dd>{item.provider}</dd>
                                  </div>
                                  <div>
                                    <dt>{section.cookies!.labels.expiry}</dt>
                                    <dd>{item.expiry}</dd>
                                  </div>
                                </dl>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                )}
                {section.after?.map((p) => (
                  <p className="body-copy" key={p}>
                    {p}
                  </p>
                ))}
                {section.consentButton && (
                  <button
                    type="button"
                    className="btn btn--primary legal__consent"
                    onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
                  >
                    <span>{t.ui.cookieBar.settings}</span>
                  </button>
                )}
              </Reveal>
            </article>
          ))}
          <p className="legal__updated">{page.updated}</p>
        </div>
      </section>
    </>
  )
}

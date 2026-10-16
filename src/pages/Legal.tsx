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
                {section.table && (
                  <div className="legal__table-wrap">
                    <table className="legal__table">
                      <thead>
                        <tr>
                          {section.table.head.map((h) => (
                            <th key={h} scope="col">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row) => (
                          <tr key={row[0]}>
                            {row.map((cell, i) =>
                              i === 0 ? (
                                <th key={i} scope="row">
                                  <code>{cell}</code>
                                </th>
                              ) : (
                                <td key={i} data-label={section.table!.head[i]}>
                                  {cell}
                                </td>
                              ),
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                    className="btn btn--pill btn--primary legal__consent"
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

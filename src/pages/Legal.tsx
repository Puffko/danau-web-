import { PageHero } from '../components/PageHero'
import { Reveal, RevealText } from '../components/Reveal'
import type { LegalPage } from '../data/site'

export default function Legal({ page, seed }: { page: LegalPage; seed: number }) {
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
              </Reveal>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

import { motion, useReducedMotion } from 'motion/react'
import { DSymbol } from '../components/Icons'
import { Wordmark } from '../components/Logo'
import { PageHero } from '../components/PageHero'
import { EASE_OUT, Reveal, RevealText } from '../components/Reveal'
import { ScrollWords } from '../components/ScrollWords'
import { about } from '../data/site'

export default function About() {
  const reduce = useReducedMotion()
  return (
    <>
      <PageHero
        title={about.title}
        text={about.text}
        seed={9}
        aside={
          <motion.div
            className="about-mark"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.4, ease: EASE_OUT }}
          >
            <Wordmark className="about-mark__logo" aria-hidden="true" />
            <svg className="about-mark__underline" viewBox="0 0 255 27" fill="none" aria-hidden="true">
              <motion.path
                d="M0.02 3.78s321.27-8.12 241.02 3.41C167.75 17.73-20.68 2.5 51.74 17.92c31.82 6.78 82.94 7.81 82.94 7.81"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, delay: 1, ease: [0.65, 0, 0.35, 1] }}
              />
            </svg>
          </motion.div>
        }
      />

      <section className="section">
        <div className="container split">
          <div className="split__head">
            <RevealText as="h2" className="display-2" text={about.whatTitle} />
          </div>
          <div className="split__body">
            <ScrollWords text={about.whatText} className="statement" />
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <RevealText as="h2" className="display-2 section-title--center" text={about.skillsTitle} />
          <ul className="skills-grid">
            {about.skills.map((skill, i) => (
              <Reveal as="li" key={skill} delay={(i % 4) * 0.06} className="skill">
                <DSymbol className="skill__mark" />
                <span className="skill__name">{skill}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

    </>
  )
}

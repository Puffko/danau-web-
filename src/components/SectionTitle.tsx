import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from './Reveal'
import { ShinyText, glint } from './ShinyText'

interface Props {
  text: string
  id?: string
  className?: string
  as?: 'h2' | 'h3'
  /** Light text and a pale-blue sweep for night grounds; ink with a brand-blue sweep otherwise. */
  tone?: 'light' | 'dark'
}

/**
 * A section heading: rises in when scrolled to, then a short white glint flicks across it every
 * few seconds (ShinyText). The band is narrow, so the heading stays legible throughout.
 */
export function SectionTitle({ text, id, className, as = 'h2', tone = 'dark' }: Props) {
  const reduce = useReducedMotion()
  const Tag = as === 'h3' ? motion.h3 : motion.h2
  return (
    <Tag
      id={id}
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{
        y: { duration: reduce ? 0 : 1.3, ease: EASE_OUT },
        opacity: { duration: reduce ? 0.4 : 1, ease: [0.33, 1, 0.68, 1] },
      }}
    >
      <ShinyText text={text} {...glint(tone)} />
    </Tag>
  )
}

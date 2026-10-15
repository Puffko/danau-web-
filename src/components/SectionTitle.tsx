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
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: reduce ? 0.4 : 1, ease: EASE_OUT }}
    >
      <ShinyText text={text} {...glint(tone)} />
    </Tag>
  )
}

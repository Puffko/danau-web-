import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from './Reveal'
import { ShinyText } from './ShinyText'

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
  const light = tone === 'light'
  return (
    <Tag
      id={id}
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: reduce ? 0.4 : 1, ease: EASE_OUT }}
    >
      <ShinyText
        text={text}
        // a quick, narrow white glint now and then rather than a coloured sweep
        color={light ? '#dde3ff' : '#111827'}
        // white on night grounds; on white ones a grey that keeps 4.8:1 against the page, so the
        // letters never fade into the background as the glint passes
        shineColor={light ? '#ffffff' : '#6b7280'}
        speed={1.4}
        delay={3.2}
        shineWidth={16}
        softness={0.6}
        angle={110}
        easing="snappy"
        glow={light ? 0.35 : 0}
      />
    </Tag>
  )
}

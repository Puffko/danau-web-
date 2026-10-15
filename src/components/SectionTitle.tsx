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
 * A section heading: rises in when scrolled to, then a band of light sweeps across it now and
 * then (ShinyText). The sweep only shifts between two high-contrast colours, so the heading stays
 * fully legible at every moment.
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
        color={light ? '#ffffff' : '#111827'}
        shineColor={light ? '#8796ff' : '#1818ec'}
        speed={2.6}
        delay={2.4}
        shineWidth={36}
        softness={0.85}
        angle={115}
      />
    </Tag>
  )
}

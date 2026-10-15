import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import { Fragment, type ElementType, type ReactNode } from 'react'
import { PixelWord } from './PixelWord'

export const EASE_OUT = [0.16, 1, 0.3, 1] as const

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'

interface RevealTextProps {
  text: string
  as?: Tag
  className?: string
  delay?: number
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean
  stagger?: number
  id?: string
  /** Words (without trailing punctuation) to build from pixels. */
  highlight?: string[]
}

/** Word-by-word masked reveal: each word rises out of its own clipping line. */
export function RevealText({
  text,
  as = 'h2',
  className,
  delay = 0,
  immediate = false,
  stagger = 0.035,
  id,
  highlight = [],
}: RevealTextProps) {
  const reduce = useReducedMotion()
  const Tag = as as ElementType
  const words = text.split(' ')
  // highlighted words are built from pixels like the footer wordmark, once their line has risen
  const renderWord = (word: string, i: number) => {
    const m = /^(.*?)([,.;:!?]*)$/.exec(word)
    const base = m ? m[1] : word
    if (!highlight.includes(base)) return word
    return (
      <>
        <PixelWord text={base} delay={reduce ? 0 : (delay + i * stagger) * 1000 + 650} />
        {m?.[2]}
      </>
    )
  }
  const trigger = immediate ? { animate: 'shown' } : { whileInView: 'shown', viewport: { once: true, margin: '0px 0px -12% 0px' } }

  return (
    <Tag className={className} id={id}>
      <motion.span
        className="reveal-text"
        initial="hidden"
        {...trigger}
        transition={{ staggerChildren: reduce ? 0 : stagger, delayChildren: delay }}
      >
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="reveal-text__mask">
              <motion.span
                className="reveal-text__word"
                variants={{
                  hidden: reduce ? { opacity: 0 } : { y: '108%', opacity: 0.001 },
                  shown: { y: '0%', opacity: 1 },
                }}
                transition={{ duration: reduce ? 0.4 : 0.9, ease: EASE_OUT }}
              >
                {renderWord(word, i)}
              </motion.span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  )
}

interface RevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
  y?: number
  immediate?: boolean
  as?: 'div' | 'li'
}

/** Rise-and-fade entrance for blocks. Content stays in the layout from the start. */
export function Reveal({ children, delay = 0, y = 24, immediate = false, as = 'div', ...rest }: RevealProps) {
  const Comp = (as === 'li' ? motion.li : motion.div) as typeof motion.div
  const reduce = useReducedMotion()
  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y }
  const shown = reduce ? { opacity: 1 } : { opacity: 1, y: 0 }
  const trigger = immediate ? { animate: shown } : { whileInView: shown, viewport: { once: true, margin: '0px 0px -10% 0px' } }
  return (
    <Comp initial={hidden} {...trigger} transition={{ duration: 1.1, delay, ease: EASE_OUT }} {...rest}>
      {children}
    </Comp>
  )
}

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import { createContext, Fragment, useContext, useState, type ElementType, type ReactNode } from 'react'
import { ShinyText, glint } from './ShinyText'

export const EASE_OUT = [0.16, 1, 0.3, 1] as const

/**
 * False while the first-load screen still covers the page: `immediate` entrances wait for it, so
 * the hero's words come in as the screen lifts rather than unseen behind it.
 */
export const RevealReady = createContext(true)

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
  /** Add the site's glint once the words are in: 'light' for night grounds, 'dark' for white. */
  shine?: 'light' | 'dark'
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
  shine,
}: RevealTextProps) {
  const reduce = useReducedMotion()
  const ready = useContext(RevealReady)
  // the sheen is painted through the letters, which hides words while they are still moving;
  // it is switched on only once the last word has landed
  const [landed, setLanded] = useState(false)
  const Tag = as as ElementType
  const words = text.split(' ')
  const trigger = immediate ? { animate: ready ? 'shown' : 'hidden' } : { whileInView: 'shown', viewport: { once: true, margin: '0px 0px -12% 0px' } }

  const content = (
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
                hidden: reduce ? { opacity: 0 } : { y: '72%', opacity: 0 },
                shown: { y: '0%', opacity: 1 },
              }}
              // a short rise with a slower fade, so each word eases in rather than pops up
              transition={{
                y: { duration: reduce ? 0 : 1.15, ease: EASE_OUT },
                opacity: { duration: reduce ? 0.4 : 0.95, ease: [0.33, 1, 0.68, 1] },
              }}
              onAnimationComplete={(def) => {
                if (def === 'shown' && i === words.length - 1) setLanded(true)
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </motion.span>
  )

  return (
    <Tag className={className} id={id}>
      {shine ? (
        <ShinyText {...glint(shine)} disabled={!landed} className={landed ? '' : 'is-off'}>
          {content}
        </ShinyText>
      ) : (
        content
      )}
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
export function Reveal({ children, delay = 0, y = 16, immediate = false, as = 'div', ...rest }: RevealProps) {
  const Comp = (as === 'li' ? motion.li : motion.div) as typeof motion.div
  const reduce = useReducedMotion()
  const ready = useContext(RevealReady)
  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y }
  const shown = reduce ? { opacity: 1 } : { opacity: 1, y: 0 }
  const trigger = immediate
    ? { animate: ready ? shown : hidden }
    : {
        whileInView: shown,
        viewport: { once: true, margin: '0px 0px -10% 0px' },
      }
  return (
    <Comp
      initial={hidden}
      {...trigger}
      transition={{
        y: { duration: 1.3, delay, ease: EASE_OUT },
        opacity: { duration: 1, delay, ease: [0.33, 1, 0.68, 1] },
      }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

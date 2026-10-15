import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'

const DIM = '#838b98'
const INK = '#111827'

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const color = useTransform(progress, range, [DIM, INK])
  return <motion.span style={{ color }}>{word} </motion.span>
}

/** A paragraph that inks in word by word as it travels up the viewport. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'end 55%'] })
  const words = text.split(' ')

  if (reduce) return <p className={className}>{text}</p>

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const start = i / words.length
        return <Word key={i} word={w} progress={scrollYProgress} range={[start, Math.min(1, start + 3 / words.length)]} />
      })}
    </p>
  )
}

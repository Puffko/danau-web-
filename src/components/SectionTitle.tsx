import { RevealText } from './Reveal'

interface Props {
  text: string
  id?: string
  className?: string
  as?: 'h2' | 'h3'
  /** White letters with a grey sheen on night grounds; ink with a grey sheen on white ones. */
  tone?: 'light' | 'dark'
}

/**
 * A section heading: its words rise in one after another when scrolled to, then the site's
 * sheen drifts across it (ShinyText).
 */
export function SectionTitle({ text, id, className, as = 'h2', tone = 'dark' }: Props) {
  return <RevealText as={as} id={id} className={className} text={text} stagger={0.06} shine={tone} />
}

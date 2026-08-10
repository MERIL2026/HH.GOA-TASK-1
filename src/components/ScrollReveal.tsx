import { type ReactNode } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: 1 | 2 | 3 | 4 | 5
  as?: 'div' | 'section' | 'span'
}

export default function ScrollReveal({
  children,
  className = '',
  delay,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLElement>()
  const delayClass = delay ? `delay-${delay}` : ''

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`scroll-reveal ${delayClass} ${className}`.trim()}
    >
      {children}
    </Tag>
  )
}

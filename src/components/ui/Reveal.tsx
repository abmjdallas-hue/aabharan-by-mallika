'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { fadeInUp, revealViewport } from '@/lib/animations'

interface RevealProps {
  children: React.ReactNode
  /** Override the default fadeInUp variant. */
  variants?: Variants
  /** Stagger delay (seconds) for sequencing sibling reveals. */
  delay?: number
  className?: string
  /** Render as a different element if needed (default div). */
  as?: 'div' | 'section' | 'li' | 'span'
}

/**
 * Scroll-reveal wrapper. Fades + rises its children into view once.
 * Safe to use inside Server Components (it's a client boundary).
 * Honours prefers-reduced-motion by rendering content statically.
 */
export default function Reveal({
  children,
  variants = fadeInUp,
  delay = 0,
  className,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]

  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  )
}

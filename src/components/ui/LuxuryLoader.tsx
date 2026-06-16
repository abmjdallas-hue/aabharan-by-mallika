'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface Props {
  /** Optional caption shown beneath the motif. */
  label?: string
  /** Diameter of the motif in px (default 56). */
  size?: number
  className?: string
}

/**
 * Jewellery-inspired loader: a slowly rotating gold ring with a
 * pulsing diamond/sparkle at its centre. Reduced-motion friendly.
 */
export default function LuxuryLoader({ label = 'Loading…', size = 56, className = '' }: Props) {
  const reduce = useReducedMotion()

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`} role="status" aria-live="polite">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Rotating gold ring */}
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-gold-200 border-t-gold-500"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        />
        {/* Pulsing centre sparkle */}
        <motion.span
          className="absolute inset-0 flex items-center justify-center font-serif text-gold-500 select-none"
          style={{ fontSize: size * 0.38 }}
          animate={reduce ? undefined : { scale: [0.85, 1.1, 0.85], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          ◆
        </motion.span>
      </div>
      {label && <p className="text-xs tracking-[0.25em] uppercase text-gold-600">{label}</p>}
      <span className="sr-only">Loading content</span>
    </div>
  )
}

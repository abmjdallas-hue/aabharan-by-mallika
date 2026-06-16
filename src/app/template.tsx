'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { pageFade } from '@/lib/animations'

/**
 * App Router template — re-mounts on every navigation, giving each
 * page a soft, premium fade-in. Reduced-motion users get no transform.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()

  if (reduce) return <>{children}</>

  return (
    <motion.div variants={pageFade} initial="hidden" animate="visible">
      {children}
    </motion.div>
  )
}

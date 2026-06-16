// ─────────────────────────────────────────────────────────────
//  LUXURY ANIMATION VARIANTS — shared Framer Motion presets
//  Elegant, slow, premium. Reduced-motion handled in components
//  via `useReducedMotion()` and globally in globals.css.
// ─────────────────────────────────────────────────────────────
import type { Variants } from 'framer-motion'

// Soft, refined easing curve (gentle ease-out) — cubic bezier
export const luxuryEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Fade + rise — the workhorse entrance for headings, text, cards. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: luxuryEase },
  },
}

/** Subtle fade with a smaller rise — for subtitles / supporting text. */
export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: luxuryEase },
  },
}

/** Parent container that staggers its children into view. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
}

/** Reusable hover/tap props for cards & images (slight lift). */
export const scaleOnHover = {
  whileHover: { y: -6, transition: { duration: 0.4, ease: luxuryEase } },
  whileTap: { scale: 0.985 },
}

/** Whole-page fade used by app/template.tsx on navigation. */
export const pageFade: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: luxuryEase },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: luxuryEase },
  },
}

/** Viewport config so reveals fire a touch before fully in view, once. */
export const revealViewport = { once: true, amount: 0.2 } as const

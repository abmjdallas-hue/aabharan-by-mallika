'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { luxuryEase } from '@/lib/animations'

export interface HeroSlide {
  id: string | number
  title: string
  subtitle: string
  description: string
  cta: string
  href: string
  gradient?: string
  image?: string
}

// Shown only when no collection photos have been uploaded yet.
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'Bridal Jewellery',
    subtitle: 'Begin Your Forever',
    description: 'Exquisite bridal sets crafted for the modern Indian bride. BIS Hallmarked & certified.',
    cta: 'Explore Bridal',
    href: '/shop?collection=Bridal+Collection',
    gradient: 'linear-gradient(135deg, #450a0a 0%, #7c2d12 55%, #92400e 100%)',
  },
  {
    id: 2,
    title: 'Temple Jewellery',
    subtitle: 'Divine Elegance',
    description: 'Hand-crafted temple jewellery inspired by centuries of South Indian artistry.',
    cta: 'Shop Temple Collection',
    href: '/shop?collection=Temple+Jewellery',
    gradient: 'linear-gradient(135deg, #3b0764 0%, #581c87 50%, #7c3aed 100%)',
  },
  {
    id: 3,
    title: 'Diamond Jewellery',
    subtitle: 'Brilliance Redefined',
    description: 'IGI certified diamond jewellery in 18KT gold settings. Every diamond tells a story.',
    cta: 'Shop Diamond',
    href: '/shop?collection=Diamond+Jewellery',
    gradient: 'linear-gradient(135deg, #0c1445 0%, #1e3a8a 55%, #1d4ed8 100%)',
  },
]

export default function HeroBanner({ collectionSlides }: { collectionSlides?: HeroSlide[] }) {
  const slides = collectionSlides && collectionSlides.length > 0 ? collectionSlides : DEFAULT_SLIDES

  const [current, setCurrent] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const slide = slides[current] ?? slides[0]

  // Stagger children: subtitle → title → divider → description → CTAs
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
  }
  const item = reduce
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: luxuryEase } },
      }

  return (
    <section className="relative h-[78vh] sm:h-[82vh] lg:h-screen max-h-[860px] overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${i === current ? 'opacity-100' : 'opacity-0'}`}
          style={s.image ? undefined : { background: s.gradient }}
        >
          {s.image ? (
            <>
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />
              {/* Darker scrim so the headline stays readable over any photo */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
            </>
          ) : (
            <>
              {/* Subtle dot-grid texture */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(246,201,14,0.5) 1px, transparent 0)',
                  backgroundSize: '40px 40px',
                }}
              />
              {/* Soft dark vignette for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
              {/* Decorative gold circles — gentle float */}
              <motion.div
                aria-hidden
                className="absolute right-0 top-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full border border-gold-400/20 opacity-30"
                animate={reduce ? undefined : { scale: [1, 1.04, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] rounded-full border border-gold-400/15 opacity-20" />
              {/* Brand mark — gentle entrance */}
              <motion.div
                aria-hidden
                className="absolute right-12 lg:right-24 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center justify-center w-48 h-48 lg:w-64 lg:h-64 rounded-full border-2 border-gold-400/30"
                initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.6, ease: luxuryEase }}
              >
                <span className="font-serif text-3xl lg:text-4xl font-bold text-gold-300/60 tracking-wide">ᳩ</span>
                <span className="font-serif text-base lg:text-lg text-gold-300/50 tracking-widest mt-1">Aabharan</span>
              </motion.div>
            </>
          )}
        </div>
      ))}

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              className="max-w-xl"
              variants={container}
              initial="hidden"
              animate="visible"
              exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.4 } }}
            >
              <motion.p
                variants={item}
                className="text-gold-300 text-sm sm:text-base tracking-[0.35em] uppercase mb-4 font-light"
              >
                {slide.subtitle}
              </motion.p>

              <motion.h1
                variants={item}
                className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-5"
              >
                {slide.title}
              </motion.h1>

              {/* Shimmering gold accent line */}
              <motion.span
                variants={item}
                className="gold-accent animate-gold-shimmer mb-6"
              />

              <motion.p
                variants={item}
                className="text-gray-200 text-sm sm:text-base mb-9 mt-2 max-w-md leading-relaxed"
              >
                {slide.description}
              </motion.p>

              <motion.div variants={item} className="flex gap-4 flex-wrap">
                <Link href={slide.href} className="btn-luxury-gold">
                  {slide.cta}
                </Link>
                <Link
                  href="/shop"
                  className="btn-luxury-outline text-white hover:bg-white hover:text-gray-900"
                >
                  View All
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 rounded-full transition-all duration-500 ${i === current ? 'bg-gold-400 w-7' : 'bg-white/50 w-2.5 hover:bg-white/80'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

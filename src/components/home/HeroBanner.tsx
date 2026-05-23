'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const slides = [
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

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[current]

  return (
    <section className="relative h-[70vh] sm:h-[80vh] lg:h-screen max-h-[800px] overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: s.gradient }}
        >
          {/* Subtle dot-grid texture */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(246,201,14,0.5) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          {/* Decorative gold circle */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full border border-gold-400/20 opacity-30" />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] rounded-full border border-gold-400/15 opacity-20" />
          {/* Brand mark */}
          <div className="absolute right-12 lg:right-24 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center justify-center w-48 h-48 lg:w-64 lg:h-64 rounded-full border-2 border-gold-400/30">
            <span className="font-serif text-3xl lg:text-4xl font-bold text-gold-300/60 tracking-wide">ᳩ</span>
            <span className="font-serif text-base lg:text-lg text-gold-300/50 tracking-widest mt-1">Aabharan</span>
          </div>
        </div>
      ))}

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <p className="text-gold-300 text-sm sm:text-base tracking-[0.3em] uppercase mb-3 font-light">
              {slide.subtitle}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {slide.title}
            </h1>
            <p className="text-gray-200 text-sm sm:text-base mb-8 max-w-sm leading-relaxed">
              {slide.description}
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href={slide.href}
                className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm rounded transition-all hover:shadow-lg"
              >
                {slide.cta}
              </Link>
              <Link
                href="/shop"
                className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold text-sm rounded transition-all"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 rounded-full transition-all ${i === current ? 'bg-gold-400 w-6' : 'bg-white/50 w-2.5'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

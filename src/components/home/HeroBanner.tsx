'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const slides = [
  {
    id: 1,
    title: 'Bridal Jewellery',
    subtitle: 'Begin Your Forever',
    description: 'Exquisite bridal sets crafted for the modern Indian bride. BIS Hallmarked & certified.',
    cta: 'Explore Bridal',
    href: '/shop?collection=Bridal+Collection',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=80',
    overlay: 'from-black/70 via-black/30 to-transparent',
  },
  {
    id: 2,
    title: 'Temple Jewellery',
    subtitle: 'Divine Elegance',
    description: 'Hand-crafted temple jewellery inspired by centuries of South Indian artistry.',
    cta: 'Shop Temple Collection',
    href: '/shop?collection=Temple+Jewellery',
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94815b0?w=1200&q=80',
    overlay: 'from-black/60 via-black/20 to-transparent',
  },
  {
    id: 3,
    title: 'Diamond Jewellery',
    subtitle: 'Brilliance Redefined',
    description: 'IGI certified diamond jewellery in 18KT gold settings. Every diamond tells a story.',
    cta: 'Shop Diamond',
    href: '/shop?collection=Diamond+Jewellery',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80',
    overlay: 'from-black/60 via-black/20 to-transparent',
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
    <section className="relative h-[70vh] sm:h-[80vh] lg:h-screen max-h-[800px] overflow-hidden bg-gray-900">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority={i === 0}
            className="object-cover object-center"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${s.overlay}`} />
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
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-gold-400 w-6' : 'bg-white/50'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

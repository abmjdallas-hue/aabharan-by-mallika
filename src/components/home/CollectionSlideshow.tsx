'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

// Auto-rotating slideshow of a single collection's uploaded photos.
// Used inside each "Our Collections" card.
export default function CollectionSlideshow({
  images,
  alt,
  interval = 4000,
}: {
  images: string[]
  alt: string
  interval?: number
}) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % images.length),
      interval
    )
    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src + i}
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-1000 ease-in-out group-hover:scale-105 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? 'bg-gold-400 w-4' : 'bg-white/60 w-1.5'
              }`}
            />
          ))}
        </div>
      )}
    </>
  )
}

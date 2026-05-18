'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Sparkles } from 'lucide-react'

interface Festival {
  name: string
  date: string // YYYY-MM-DD
  message: string
  cta: string
  href: string
  color: string
}

// Update dates each year
const FESTIVALS: Festival[] = [
  {
    name: 'Diwali',
    date: '2025-10-20',
    message: 'Celebrate Diwali with exclusive jewellery offers',
    cta: 'Shop Diwali Collection',
    href: '/shop?collection=Festive+Collection',
    color: 'from-amber-600 to-maroon-600',
  },
  {
    name: 'Navratri',
    date: '2025-10-02',
    message: 'Navratri specials — temple jewellery starting at $199',
    cta: 'Shop Now',
    href: '/shop?collection=Temple+Jewellery',
    color: 'from-maroon-600 to-pink-700',
  },
  {
    name: 'Ugadi',
    date: '2026-03-19',
    message: 'New Year, New Jewellery — Ugadi offers are live',
    cta: 'Explore Offers',
    href: '/shop',
    color: 'from-gold-600 to-maroon-600',
  },
  {
    name: 'Akshaya Tritiya',
    date: '2026-04-28',
    message: 'Akshaya Tritiya — the most auspicious day to buy gold',
    cta: 'Buy Gold Jewellery',
    href: '/shop?collection=Gold+Jewellery',
    color: 'from-yellow-600 to-gold-600',
  },
  {
    name: 'Wedding Season',
    date: '2026-01-15',
    message: 'Wedding season is here — bridal sets crafted to order',
    cta: 'Explore Bridal',
    href: '/shop?collection=Bridal+Collection',
    color: 'from-maroon-600 to-rose-700',
  },
]

function getDaysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function getActiveFestival(): Festival | null {
  // Show festival banner if within 30 days before OR on the day
  const upcoming = FESTIVALS
    .map((f) => ({ ...f, days: getDaysUntil(f.date) }))
    .filter((f) => f.days >= 0 && f.days <= 30)
    .sort((a, b) => a.days - b.days)

  return upcoming[0] ?? null
}

export default function FestivalBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [festival, setFestival] = useState<(Festival & { days: number }) | null>(null)

  useEffect(() => {
    const f = getActiveFestival()
    if (f) setFestival({ ...f, days: getDaysUntil(f.date) })
  }, [])

  if (!festival || dismissed) return null

  return (
    <div className={`relative bg-gradient-to-r ${festival.color} text-white py-3 px-4`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
        <Sparkles size={16} className="text-gold-200 shrink-0 hidden sm:block" />
        <span className="text-sm font-medium">
          {festival.message}
          {festival.days === 0 ? (
            <span className="ml-2 bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">Today!</span>
          ) : (
            <span className="ml-2 text-white/80 text-xs">
              {festival.days === 1 ? 'Tomorrow' : `${festival.days} days away`}
            </span>
          )}
        </span>
        <Link
          href={festival.href}
          className="shrink-0 bg-white/20 hover:bg-white/30 border border-white/40 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
        >
          {festival.cta} →
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}

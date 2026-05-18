'use client'

import { useState, useEffect } from 'react'
import { X, TrendingUp } from 'lucide-react'

interface GoldRate {
  pricePerGram22KT: number
  pricePerGram24KT: number
  updatedAt: string
  isFallback?: boolean
}

const MESSAGES = [
  'Free in-store pickup · Frisco, TX · Tue–Sun 12–7:30 pm',
  'BIS Hallmarked jewellery — certified purity guaranteed',
  'Insured FedEx shipping across the USA',
  'Bridal sets available — book a private appointment',
]

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  const [goldRate, setGoldRate] = useState<GoldRate | null>(null)
  const [msgIndex, setMsgIndex] = useState(0)
  const [showGold, setShowGold] = useState(true)

  useEffect(() => {
    fetch('/api/gold-rate')
      .then((r) => r.json())
      .then(setGoldRate)
      .catch(() => {})
  }, [])

  // Rotate between gold rate and info messages every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setShowGold((prev) => {
        if (!prev) setMsgIndex((i) => (i + 1) % MESSAGES.length)
        return !prev
      })
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="bg-maroon-500 text-white text-xs sm:text-sm py-2 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center min-h-[20px]">
        {showGold ? (
          <span className="flex items-center gap-2 transition-all">
            <TrendingUp size={13} className="text-gold-300 shrink-0" />
            <span>
              Live Gold Rate —{' '}
              <strong className="text-gold-200">
                22KT ${goldRate ? goldRate.pricePerGram22KT.toFixed(2) : '…'}/g
              </strong>
              {goldRate && (
                <span className="text-white/60 ml-1.5 text-[10px]">
                  · 24KT ${goldRate.pricePerGram24KT.toFixed(2)}/g
                  {goldRate.isFallback ? ' (est.)' : ''}
                </span>
              )}
            </span>
          </span>
        ) : (
          <span className="transition-all">{MESSAGES[msgIndex]}</span>
        )}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
        aria-label="Close"
      >
        <X size={14} />
      </button>
    </div>
  )
}

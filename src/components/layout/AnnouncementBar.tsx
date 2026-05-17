'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div className="bg-maroon-500 text-white text-xs sm:text-sm py-2 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-center">
        <span>
          Today&apos;s Gold Rate: 22KT —{' '}
          <strong className="text-gold-200">$61.20/g</strong>
          &nbsp;|&nbsp; Shipping confirmed after order via WhatsApp
          &nbsp;|&nbsp; BIS Hallmarked Jewellery
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
        aria-label="Close"
      >
        <X size={14} />
      </button>
    </div>
  )
}

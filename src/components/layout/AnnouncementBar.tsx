'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const MESSAGES = [
  'Free in-store pickup · Frisco, TX · Tue–Sun 12–7:30 pm',
  'BIS Hallmarked jewellery — certified purity guaranteed',
  'Insured FedEx shipping across the USA',
  'Bridal sets available — book a private appointment',
]

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="bg-maroon-500 text-white text-xs sm:text-sm py-2 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center min-h-[20px]">
        <span>{MESSAGES[msgIndex]}</span>
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

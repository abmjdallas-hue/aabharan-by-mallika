'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section className="py-14 sm:py-20 bg-beige border-t border-gold-200">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-gold-600 text-sm tracking-widest uppercase mb-2">Stay in the Know</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-500 mb-3">
          Join the Aabharan Circle
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mb-8">
          Subscribe for exclusive new arrivals, bridal lookbooks, festive offers, and jewellery care tips.
        </p>

        {submitted ? (
          <div className="py-4 px-6 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Thank you for subscribing! Watch your inbox for exclusive offers.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gold-300 rounded text-sm outline-none focus:border-maroon-400 bg-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-maroon-500 hover:bg-maroon-600 text-white text-sm font-semibold rounded transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

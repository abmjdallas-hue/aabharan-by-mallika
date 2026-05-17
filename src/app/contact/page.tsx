'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { BUSINESS, fullAddress, whatsappBaseUrl } from '@/lib/config'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise((r) => setTimeout(r, 800))
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-beige border-b border-gold-200 py-10 sm:py-14 text-center">
        <p className="section-label">Get in Touch</p>
        <h1 className="section-title">Contact Us</h1>
        <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
          Have a question about a piece, custom order, or just want to say hello? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gold-100 p-6 shadow-sm">
              <h2 className="font-serif font-bold text-gray-800 mb-4">Store Information</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin size={18} className="text-gold-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p className="text-sm text-gray-500 mt-0.5">{fullAddress}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone size={18} className="text-gold-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <a href={`tel:${BUSINESS.phoneRaw}`} className="text-sm text-maroon-500 hover:underline">{BUSINESS.phone}</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail size={18} className="text-gold-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <a href={`mailto:${BUSINESS.email}`} className="text-sm text-maroon-500 hover:underline">{BUSINESS.email}</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock size={18} className="text-gold-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Hours</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {BUSINESS.hoursOpen}<br />{BUSINESS.hoursClosed}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href={`${whatsappBaseUrl}?text=${encodeURIComponent("Hello! I'd like to enquire about your jewellery.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors w-full"
            >
              <MessageCircle size={20} />
              <div>
                <p className="text-sm font-semibold">Chat on WhatsApp</p>
                <p className="text-xs text-green-100">Typically replies within an hour</p>
              </div>
            </a>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gold-100 p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif font-bold text-gray-800 mb-6">Send Us a Message</h2>

            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={28} className="text-green-500" />
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                <p className="text-sm text-gray-500">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-maroon-500 hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your Name" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Email *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="(555) 123-4567" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Subject *</label>
                    <select required value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="input-field">
                      <option value="">Select a subject</option>
                      <option>Product Enquiry</option>
                      <option>Custom Order</option>
                      <option>Order Status</option>
                      <option>Return / Exchange</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Message *</label>
                  <textarea required value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={5} placeholder="Tell us how we can help you…" className="input-field resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full py-3.5">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

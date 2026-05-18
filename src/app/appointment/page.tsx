'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, MapPin, MessageCircle, CheckCircle, ChevronRight } from 'lucide-react'
import { whatsappBaseUrl } from '@/lib/config'

const APPOINTMENT_TYPES = [
  { id: 'bridal', label: 'Bridal Consultation', duration: '60 min', desc: 'Full bridal set selection with styling advice' },
  { id: 'general', label: 'General Shopping', duration: '30 min', desc: 'Browse collection with personalised assistance' },
  { id: 'custom', label: 'Custom Design', duration: '45 min', desc: 'Discuss a bespoke piece crafted to your vision' },
  { id: 'repair', label: 'Repair / Resize', duration: '15 min', desc: 'Assessment for repair, resizing or polishing' },
]

const TIME_SLOTS = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM',
]

export default function AppointmentPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState({
    type: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const selectedType = APPOINTMENT_TYPES.find((t) => t.id === form.type)

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  const handleSubmit = () => {
    const msg = [
      `*Appointment Request — Aabharan by Mallika*`,
      ``,
      `Type: ${selectedType?.label}`,
      `Date: ${new Date(form.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      `Time: ${form.time}`,
      ``,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      form.notes ? `Notes: ${form.notes}` : '',
    ].filter(Boolean).join('\n')

    window.open(`${whatsappBaseUrl}?text=${encodeURIComponent(msg)}`, '_blank')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold text-gray-800 mb-2">Request Sent!</h1>
          <p className="text-gray-500 text-sm mb-6">
            Your appointment request has been sent via WhatsApp. We&apos;ll confirm your slot within a few hours during store hours (Tue–Sun, 12–7:30 pm).
          </p>
          <Link href="/" className="inline-block px-6 py-3 bg-maroon-500 text-white rounded-lg text-sm font-semibold hover:bg-maroon-600 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <div className="bg-beige border-b border-gold-100 py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gold-600 text-xs tracking-widest uppercase mb-2">Private Appointments</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-500 mb-3">Book an Appointment</h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Enjoy a personalised, one-on-one shopping experience at our Frisco, TX store.
            We&apos;ll have your selections ready before you arrive.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Store info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: MapPin, label: 'Location', value: 'Frisco, TX 75034' },
            { icon: Clock, label: 'Hours', value: 'Tue–Sun · 12 noon – 7:30 pm' },
            { icon: Calendar, label: 'Booking', value: 'Same day & advance' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gold-100">
              <Icon size={18} className="text-gold-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-sm text-gray-700 font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? 'bg-maroon-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {s}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step >= s ? 'text-maroon-500' : 'text-gray-400'}`}>
                {s === 1 ? 'Choose type' : s === 2 ? 'Pick date & time' : 'Your details'}
              </span>
              {s < 3 && <ChevronRight size={14} className="text-gray-300" />}
            </div>
          ))}
        </div>

        {/* Step 1 — Appointment type */}
        {step === 1 && (
          <div>
            <h2 className="font-semibold text-gray-800 mb-4">What brings you in?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {APPOINTMENT_TYPES.map((t) => (
                <button key={t.id} onClick={() => { set('type', t.id); setStep(2) }}
                  className={`text-left p-4 rounded-xl border-2 transition-all hover:border-maroon-400 ${form.type === t.id ? 'border-maroon-500 bg-maroon-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-800">{t.label}</span>
                    <span className="text-xs text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full">{t.duration}</span>
                  </div>
                  <p className="text-xs text-gray-500">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Date & time */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold text-gray-800 mb-4">Choose a date</h2>
              <input type="date" min={minDateStr} value={form.date} onChange={(e) => set('date', e.target.value)}
                className="input-field max-w-xs" />
              <p className="text-xs text-gray-400 mt-1">We&apos;re open Tuesday through Sunday</p>
            </div>
            {form.date && (
              <div>
                <h2 className="font-semibold text-gray-800 mb-4">Preferred time</h2>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button key={slot} onClick={() => set('time', slot)}
                      className={`py-2 rounded-lg text-xs font-medium border transition-all ${form.time === slot ? 'bg-maroon-500 text-white border-maroon-500' : 'border-gray-200 text-gray-700 hover:border-maroon-300 bg-white'}`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">← Back</button>
              {form.date && form.time && (
                <button onClick={() => setStep(3)} className="px-5 py-2.5 bg-maroon-500 text-white rounded-lg text-sm font-semibold hover:bg-maroon-600">Continue →</button>
              )}
            </div>
          </div>
        )}

        {/* Step 3 — Contact details */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-gray-800">Your details</h2>

            {/* Summary */}
            <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 text-sm space-y-1">
              <p><span className="text-gray-500">Type:</span> <strong>{selectedType?.label}</strong></p>
              <p><span className="text-gray-500">Date:</span> <strong>{new Date(form.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong></p>
              <p><span className="text-gray-500">Time:</span> <strong>{form.time}</strong></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name *</label>
                <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className="input-field" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone *</label>
                <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="input-field" placeholder="+1 (469) 000-0000" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="input-field" placeholder="you@email.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes (optional)</label>
              <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} className="input-field resize-none"
                placeholder="e.g. Looking for a bridal necklace set under $3,000 · Gold preferred" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">← Back</button>
              <button
                onClick={handleSubmit}
                disabled={!form.name || !form.phone}
                className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle size={16} /> Confirm via WhatsApp
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center">Your request will be sent via WhatsApp. We confirm within a few hours.</p>
          </div>
        )}
      </div>
    </div>
  )
}

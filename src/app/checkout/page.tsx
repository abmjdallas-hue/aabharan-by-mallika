'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShieldCheck, ChevronRight, Copy, CheckCircle2,
  Store, Truck, Loader2, AlertCircle, ShieldPlus,
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '@/context/CartContext'
import { BUSINESS, fullAddress, calcInsurance } from '@/lib/config'

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

// ── Types ────────────────────────────────────────────────────────────────────

interface ContactInfo { name: string; phone: string; email: string }
interface ShipAddress extends ContactInfo {
  address: string; city: string; state: string; zip: string
}
interface FedExRate {
  service: string; name: string; price: number; deliveryDate?: string
}

// ── Constants ────────────────────────────────────────────────────────────────

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming','Washington D.C.',
]

// ── Sub-components ───────────────────────────────────────────────────────────

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center justify-between bg-white rounded-lg border border-blue-100 px-3 py-2">
      <span className="text-xs text-gray-500 font-semibold">{label}:</span>
      <span className="text-xs font-bold text-gray-800 mx-2 flex-1">{value}</span>
      <button
        type="button"
        onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
        className="text-blue-500 hover:text-blue-700 transition-colors"
      >
        {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
      </button>
    </div>
  )
}

// ── Stripe payment section (must be inside <Elements> provider) ──────────────

function StripePaymentSection({
  grandTotal,
  validate,
  getOrderData,
  clearCart,
}: {
  grandTotal: number
  validate: () => boolean
  getOrderData: (orderId: string) => object
  clearCart: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [paying, setPaying] = useState(false)
  const [stripeError, setStripeError] = useState<string | null>(null)

  const handlePay = async () => {
    if (!stripe || !elements) return
    if (!validate()) return
    setPaying(true)
    setStripeError(null)
    const orderId = `ABM${Date.now()}`
    clearCart()
    localStorage.setItem('aabharan-last-order', JSON.stringify(getOrderData(orderId)))
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success?id=${orderId}`,
      },
    })
    if (error) {
      setStripeError(error.message ?? 'Payment failed. Please try again.')
      setPaying(false)
    }
  }

  return (
    <div className="mt-4 space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {stripeError && (
        <div className="flex items-center gap-1.5 text-xs text-red-500 p-2.5 bg-red-50 rounded-lg border border-red-100">
          <AlertCircle size={12} className="shrink-0" /> {stripeError}
        </div>
      )}
      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || !elements || paying}
        className="w-full py-3.5 bg-maroon-500 hover:bg-maroon-600 disabled:bg-maroon-300 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {paying
          ? <><Loader2 size={16} className="animate-spin" /> Processing…</>
          : <><ShieldCheck size={16} /> Pay ${grandTotal.toFixed(2)}</>
        }
      </button>
      <p className="text-xs text-center text-gray-400">
        Credit / debit card &amp; Affirm installments · Secured by Stripe
      </p>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()

  // Delivery & contact
  const [deliveryMethod, setDeliveryMethod] = useState<'ship' | 'pickup'>('ship')
  const [contact, setContact] = useState<ContactInfo>({ name: '', phone: '', email: '' })
  const [shipAddr, setShipAddr] = useState<ShipAddress>({
    name: '', phone: '', email: '', address: '', city: '', state: '', zip: '',
  })

  // FedEx rates
  const [rates, setRates] = useState<FedExRate[]>([])
  const [ratesLoading, setRatesLoading] = useState(false)
  const [ratesError, setRatesError] = useState<string | null>(null)
  const [fedexUnavailable, setFedexUnavailable] = useState(false)
  const [selectedRate, setSelectedRate] = useState<FedExRate | null>(null)
  const zipDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Insurance
  const [insureOrder, setInsureOrder] = useState(false)
  const [declaredValue, setDeclaredValue] = useState(subtotal)
  const insuranceCost = insureOrder ? calcInsurance(declaredValue) : 0

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ── Fetch FedEx rates when ZIP changes ───────────────────────────────────
  useEffect(() => {
    if (deliveryMethod !== 'ship') return
    const zip = shipAddr.zip.trim()
    if (!/^\d{5}$/.test(zip)) {
      setRates([]); setSelectedRate(null); setRatesError(null)
      return
    }
    if (zipDebounce.current) clearTimeout(zipDebounce.current)
    zipDebounce.current = setTimeout(async () => {
      setRatesLoading(true); setRatesError(null); setRates([]); setSelectedRate(null)
      try {
        const res = await fetch('/api/fedex-rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destinationZip: zip,
            weightLb: BUSINESS.packageWeightLb,
            declaredValue: insureOrder ? declaredValue : 0,
          }),
        })
        const data = await res.json()
        if (data.error === 'not_configured') {
          setFedexUnavailable(true)
        } else if (data.error) {
          setRatesError('Could not fetch FedEx rates. Please try again.')
        } else {
          setFedexUnavailable(false)
          setRates(data.rates ?? [])
          if (data.rates?.length) setSelectedRate(data.rates[0])
        }
      } catch {
        setRatesError('Network error fetching rates.')
      } finally {
        setRatesLoading(false)
      }
    }, 600)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipAddr.zip, deliveryMethod])

  // Re-fetch rates if insurance toggle changes (declared value affects FedEx price)
  useEffect(() => {
    if (rates.length && shipAddr.zip.length === 5) {
      // Trigger re-fetch by resetting zip then restoring (simplest approach)
      const zip = shipAddr.zip
      setShipAddr(a => ({ ...a, zip: '' }))
      setTimeout(() => setShipAddr(a => ({ ...a, zip })), 50)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insureOrder, declaredValue])

  // Create PaymentIntent when card is selected and total is known
  useEffect(() => {
    if (paymentMethod !== 'card' || !stripePromise) { setClientSecret(null); return }
    if (grandTotal === null || grandTotal < 50) return
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amountCents: Math.round(grandTotal * 100),
        shipping: deliveryMethod === 'ship' ? {
          name: shipAddr.name, address: shipAddr.address,
          city: shipAddr.city, state: shipAddr.state, zip: shipAddr.zip,
        } : null,
      }),
    })
      .then(r => r.json())
      .then(data => { if (data.clientSecret) setClientSecret(data.clientSecret) })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, grandTotal])

  // ── Totals ───────────────────────────────────────────────────────────────
  const shippingCost = deliveryMethod === 'pickup' ? 0 : (selectedRate?.price ?? null)
  const tax = Math.round(subtotal * BUSINESS.taxRate * 100) / 100
  const grandTotal = shippingCost !== null
    ? Math.round((subtotal + shippingCost + insuranceCost + tax) * 100) / 100
    : null

  // ── Helpers ──────────────────────────────────────────────────────────────
  const setShip = (k: keyof ShipAddress, v: string) => setShipAddr(a => ({ ...a, [k]: v }))
  const setCtx  = (k: keyof ContactInfo,  v: string) => setContact(a => ({ ...a, [k]: v }))

  const validate = () => {
    const e: Record<string, string> = {}
    const n = deliveryMethod === 'ship' ? shipAddr.name  : contact.name
    const p = deliveryMethod === 'ship' ? shipAddr.phone : contact.phone
    const em = deliveryMethod === 'ship' ? shipAddr.email : contact.email
    if (!n.trim()) e.name = 'Name is required'
    if (!p.match(/^\+?[\d\s\-()]{7,15}$/)) e.phone = 'Enter a valid phone number'
    if (!em.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email'
    if (deliveryMethod === 'ship') {
      if (!shipAddr.address.trim()) e.address = 'Street address is required'
      if (!shipAddr.city.trim()) e.city = 'City is required'
      if (!shipAddr.state) e.state = 'State is required'
      if (!shipAddr.zip.match(/^\d{5}(-\d{4})?$/)) e.zip = 'Enter a valid 5-digit ZIP'
      if (!selectedRate && !fedexUnavailable) e.service = 'Please select a shipping service'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const getOrderData = (orderId: string) => {
    const shippingAddress = deliveryMethod === 'ship' ? shipAddr
      : { ...contact, address: fullAddress, city: BUSINESS.city, state: BUSINESS.state, zip: BUSINESS.zip }
    return {
      id: orderId, items, subtotal,
      shipping: shippingCost ?? 0,
      selectedService: selectedRate?.name ?? (deliveryMethod === 'pickup' ? 'Pickup' : 'TBD'),
      insurance: insuranceCost, declaredValue: insureOrder ? declaredValue : 0,
      tax, grandTotal: grandTotal ?? subtotal + tax,
      shippingAddress, deliveryMethod, paymentMethod,
      status: 'confirmed', createdAt: new Date().toISOString(),
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    const orderId = `ABM${Date.now()}`
    localStorage.setItem('aabharan-last-order', JSON.stringify(getOrderData(orderId)))
    clearCart()
    router.push(`/order-success?id=${orderId}`)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-maroon-500 mb-3">Your cart is empty</h2>
        <Link href="/shop" className="mt-4 px-6 py-3 bg-maroon-500 text-white rounded-lg text-sm font-semibold">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-beige border-b border-gold-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/cart" className="hover:text-maroon-500">Cart</Link>
            <ChevronRight size={14} />
            <span className="text-maroon-500 font-medium">Checkout</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-maroon-500">Secure Checkout</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── LEFT ── */}
            <div className="flex-1 space-y-6">

              {/* Delivery method */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-serif text-lg font-bold text-gray-800 mb-4">How would you like to receive your order?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${deliveryMethod === 'ship' ? 'border-maroon-400 bg-maroon-50' : 'border-gray-100 hover:border-gold-200'}`}>
                    <input type="radio" name="delivery" value="ship" checked={deliveryMethod === 'ship'}
                      onChange={() => { setDeliveryMethod('ship'); setRates([]); setSelectedRate(null); if (paymentMethod === 'cod') setPaymentMethod('upi') }}
                      className="mt-1 text-maroon-500 shrink-0" />
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Truck size={14} className="text-maroon-500" />
                        <p className="text-sm font-semibold text-gray-800">Ship to My Address</p>
                      </div>
                      <p className="text-xs text-gray-400">FedEx — rate calculated by ZIP code</p>
                    </div>
                  </label>
                  <label className={`flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${deliveryMethod === 'pickup' ? 'border-maroon-400 bg-maroon-50' : 'border-gray-100 hover:border-gold-200'}`}>
                    <input type="radio" name="delivery" value="pickup" checked={deliveryMethod === 'pickup'}
                      onChange={() => setDeliveryMethod('pickup')}
                      className="mt-1 text-maroon-500 shrink-0" />
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Store size={14} className="text-green-600" />
                        <p className="text-sm font-semibold text-gray-800">
                          Pickup at Store <span className="text-green-600 text-xs font-bold ml-1">Free</span>
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">{BUSINESS.addressLine1}, {BUSINESS.city} · {BUSINESS.hoursOpen}</p>
                    </div>
                  </label>
                </div>
              </section>

              {/* Address / Contact */}
              {deliveryMethod === 'ship' ? (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h2 className="font-serif text-lg font-bold text-gray-800">Shipping Address</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name *</label>
                      <input type="text" value={shipAddr.name} onChange={e => setShip('name', e.target.value)}
                        placeholder="Jane Smith" className={`input-field ${errors.name ? 'border-red-400' : ''}`} />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone *</label>
                      <input type="tel" value={shipAddr.phone} onChange={e => setShip('phone', e.target.value)}
                        placeholder="(555) 123-4567" className={`input-field ${errors.phone ? 'border-red-400' : ''}`} />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Email *</label>
                      <input type="email" value={shipAddr.email} onChange={e => setShip('email', e.target.value)}
                        placeholder="jane@example.com" className={`input-field ${errors.email ? 'border-red-400' : ''}`} />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Street Address *</label>
                      <input type="text" value={shipAddr.address} onChange={e => setShip('address', e.target.value)}
                        placeholder="123 Oak Street, Apt 4B" className={`input-field ${errors.address ? 'border-red-400' : ''}`} />
                      {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">City *</label>
                      <input type="text" value={shipAddr.city} onChange={e => setShip('city', e.target.value)}
                        placeholder="Dallas" className={`input-field ${errors.city ? 'border-red-400' : ''}`} />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">State *</label>
                      <select value={shipAddr.state} onChange={e => setShip('state', e.target.value)}
                        className={`input-field ${errors.state ? 'border-red-400' : ''}`}>
                        <option value="">Select State</option>
                        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">ZIP Code *</label>
                      <input type="text" value={shipAddr.zip} onChange={e => setShip('zip', e.target.value)}
                        placeholder="75201" maxLength={10} className={`input-field ${errors.zip ? 'border-red-400' : ''}`} />
                      {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                    </div>
                  </div>

                  {/* FedEx rate results */}
                  <div>
                    {ratesLoading && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 py-3">
                        <Loader2 size={16} className="animate-spin text-maroon-500" />
                        Fetching FedEx rates for ZIP {shipAddr.zip}…
                      </div>
                    )}

                    {ratesError && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        {ratesError}
                      </div>
                    )}

                    {fedexUnavailable && (
                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
                        <p className="font-semibold mb-1">FedEx rates not yet configured</p>
                        <p>Add your FedEx API credentials to <code>.env.local</code> to enable live rates. We will confirm the exact shipping cost with you via WhatsApp after you place your order.</p>
                      </div>
                    )}

                    {rates.length > 0 && (
                      <div className="space-y-2 mt-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Select Shipping Service</p>
                        {rates.map(rate => (
                          <label key={rate.service}
                            className={`flex items-center justify-between gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedRate?.service === rate.service ? 'border-maroon-400 bg-maroon-50' : 'border-gray-100 hover:border-gold-200'}`}>
                            <div className="flex items-center gap-2.5">
                              <input type="radio" name="fedex_service" checked={selectedRate?.service === rate.service}
                                onChange={() => setSelectedRate(rate)} className="text-maroon-500" />
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{rate.name}</p>
                                {rate.deliveryDate && <p className="text-xs text-gray-400">Est. {rate.deliveryDate}</p>}
                              </div>
                            </div>
                            <span className="text-sm font-bold text-maroon-500 shrink-0">${rate.price.toFixed(2)}</span>
                          </label>
                        ))}
                        {errors.service && <p className="text-xs text-red-500">{errors.service}</p>}
                      </div>
                    )}
                  </div>
                </section>
              ) : (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h2 className="font-serif text-lg font-bold text-gray-800">Your Contact Details</h2>
                  <p className="text-xs text-gray-400">We'll confirm your pickup appointment via WhatsApp or email.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name *</label>
                      <input type="text" value={contact.name} onChange={e => setCtx('name', e.target.value)}
                        placeholder="Jane Smith" className={`input-field ${errors.name ? 'border-red-400' : ''}`} />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone *</label>
                      <input type="tel" value={contact.phone} onChange={e => setCtx('phone', e.target.value)}
                        placeholder="(555) 123-4567" className={`input-field ${errors.phone ? 'border-red-400' : ''}`} />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Email *</label>
                      <input type="email" value={contact.email} onChange={e => setCtx('email', e.target.value)}
                        placeholder="jane@example.com" className={`input-field ${errors.email ? 'border-red-400' : ''}`} />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="p-3 bg-gold-50 border border-gold-100 rounded-lg text-xs text-gray-600 space-y-0.5">
                    <p className="font-semibold text-gray-800">Pickup Location</p>
                    <p>{fullAddress}</p>
                    <p>{BUSINESS.hoursOpen} · {BUSINESS.hoursClosed}</p>
                  </div>
                </section>
              )}

              {/* Insurance */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start gap-3">
                  <ShieldPlus size={20} className="text-gold-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Shipping Insurance (FedEx Declared Value)</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          First $100 covered free · $0.90 per additional $100
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input type="checkbox" className="sr-only peer" checked={insureOrder}
                          onChange={e => setInsureOrder(e.target.checked)} />
                        <div className="w-10 h-5 bg-gray-200 peer-checked:bg-maroon-500 rounded-full transition-colors" />
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                      </label>
                    </div>

                    {insureOrder && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Declared Value (USD)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                            <input
                              type="number" min={0} step={1}
                              value={declaredValue}
                              onChange={e => setDeclaredValue(Math.max(0, Number(e.target.value)))}
                              className="input-field pl-7"
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Pre-filled with your cart total. Increase if gifting or for full replacement value.</p>
                        </div>
                        <div className="flex justify-between text-sm p-3 bg-gold-50 border border-gold-100 rounded-lg">
                          <span className="text-gray-600">Insurance cost</span>
                          <span className="font-bold text-maroon-500">
                            {insuranceCost === 0 ? 'Free (under $100)' : `$${insuranceCost.toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-serif text-lg font-bold text-gray-800 mb-5">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: 'upi', label: 'Zelle / Digital Wallet', desc: 'Zelle, Venmo, PayPal, Cash App' },
                    ...(deliveryMethod === 'pickup'
                      ? [{ id: 'cod', label: 'Pay at Pickup', desc: 'Cash or card when you collect in-store' }]
                      : []
                    ),
                    { id: 'card', label: 'Credit / Debit Card (coming soon)', desc: 'Visa, Mastercard, Amex — secured by Stripe' },
                  ].map(opt => (
                    <label key={opt.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === opt.id ? 'border-maroon-400 bg-maroon-50' : 'border-gray-100 hover:border-gold-200'}`}>
                      <input type="radio" name="payment" value={opt.id} checked={paymentMethod === opt.id}
                        onChange={() => setPaymentMethod(opt.id as typeof paymentMethod)} className="mt-0.5 text-maroon-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'upi' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg space-y-3">
                    <p className="text-sm font-semibold text-gray-800">Send payment after placing your order:</p>
                    <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                      <li>Click Place Order below</li>
                      <li>Send the exact total to one of the options below</li>
                      <li>Include your order number in the payment note</li>
                      <li>We confirm and {deliveryMethod === 'pickup' ? 'prepare your order' : 'ship'} once received</li>
                    </ol>
                    <div className="space-y-2 pt-1">
                      {BUSINESS.zellePhone && <CopyField label="Zelle" value={BUSINESS.zellePhone} />}
                      {BUSINESS.zelleEmail && <CopyField label="Zelle email" value={BUSINESS.zelleEmail} />}
                      {BUSINESS.venmoHandle && <CopyField label="Venmo" value={BUSINESS.venmoHandle} />}
                      {BUSINESS.paypalEmail && <CopyField label="PayPal" value={BUSINESS.paypalEmail} />}
                      {BUSINESS.cashappHandle && <CopyField label="Cash App" value={BUSINESS.cashappHandle} />}
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  !stripePromise ? (
                    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100 text-xs text-center text-amber-700">
                      <p className="font-medium">Card payments not yet configured</p>
                      <p className="mt-1">Add your Stripe keys to .env.local to enable card &amp; Affirm.</p>
                    </div>
                  ) : grandTotal === null ? (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-center text-blue-600">
                      Enter your shipping ZIP above to calculate the total before paying.
                    </div>
                  ) : grandTotal < 50 ? (
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 text-xs text-center text-amber-700">
                      Minimum $50 required for card / Affirm payments.
                    </div>
                  ) : !clientSecret ? (
                    <div className="mt-4 flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
                      <Loader2 size={16} className="animate-spin" /> Loading payment options…
                    </div>
                  ) : (
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#7c2d12' } } }}
                    >
                      <StripePaymentSection
                        grandTotal={grandTotal}
                        validate={validate}
                        getOrderData={getOrderData}
                        clearCart={clearCart}
                      />
                    </Elements>
                  )
                )}
              </section>
            </div>

            {/* ── RIGHT — Summary ── */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="font-serif text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">Qty {quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-gray-800 shrink-0">
                        ${(product.price * quantity).toLocaleString('en-US')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="border-t border-gold-100 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${subtotal.toLocaleString('en-US')}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">
                      {deliveryMethod === 'pickup' ? 'Shipping' : 'FedEx Shipping'}
                    </span>
                    {deliveryMethod === 'pickup' ? (
                      <span className="text-green-600 font-semibold text-xs">Free (Pickup)</span>
                    ) : selectedRate ? (
                      <span className="font-medium">${selectedRate.price.toFixed(2)}</span>
                    ) : ratesLoading ? (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Loader2 size={10} className="animate-spin" /> Calculating…
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 italic">Enter ZIP to calculate</span>
                    )}
                  </div>

                  {insureOrder && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center gap-1">
                        <ShieldPlus size={12} className="text-gold-500" /> Insurance
                      </span>
                      <span className="font-medium">{insuranceCost === 0 ? 'Free' : `$${insuranceCost.toFixed(2)}`}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax ({Math.round(BUSINESS.taxRate * 100)}%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gold-200 mt-3 pt-3">
                  {grandTotal !== null ? (
                    <div className="flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span className="text-maroon-500">${grandTotal.toLocaleString('en-US')}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-gray-800">Est. Total</span>
                      <div className="text-right">
                        <p className="font-bold text-maroon-500">${(subtotal + tax + insuranceCost).toLocaleString('en-US')}</p>
                        <p className="text-xs text-gray-400">+ shipping</p>
                      </div>
                    </div>
                  )}
                </div>

                {paymentMethod !== 'card' ? (
                  <button type="submit" disabled={loading}
                    className="mt-5 w-full py-3.5 bg-maroon-500 hover:bg-maroon-600 disabled:bg-maroon-300 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Processing…</>
                    ) : (
                      <><ShieldCheck size={16} /> Place Order</>
                    )}
                  </button>
                ) : (
                  <p className="mt-5 text-xs text-center text-gray-400 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    Use the <strong className="text-gray-600">Pay</strong> button in the payment section to complete your order.
                  </p>
                )}

                <p className="text-xs text-center text-gray-400 mt-3">
                  By placing your order you agree to our{' '}
                  <Link href="/policies/terms" className="text-maroon-500 hover:underline">Terms & Conditions</Link>
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}

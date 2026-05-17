'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Truck, Home } from 'lucide-react'
import { Order } from '@/types'

function OrderSuccessContent() {
  const params = useSearchParams()
  const orderId = params.get('id')
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('aabharan-last-order')
    if (saved) {
      try { setOrder(JSON.parse(saved)) } catch {}
    }
  }, [])

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </div>

        <h1 className="font-serif text-3xl font-bold text-maroon-500 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 text-sm mb-6">
          Thank you for your purchase. We&apos;ll send you a confirmation email shortly.
        </p>

        <div className="bg-white rounded-xl border border-gold-200 p-5 mb-6 text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Order ID</span>
            <span className="text-sm font-bold text-gray-800">#{orderId}</span>
          </div>
          {order && (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Total Amount</span>
                <span className="text-sm font-bold text-maroon-500">
                  ${order.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Payment</span>
                <span className="text-sm font-medium text-gray-700 capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Deliver to</span>
                <span className="text-sm font-medium text-gray-700 text-right max-w-[55%]">
                  {order.shippingAddress.name}, {order.shippingAddress.city}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-gold-200 p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 text-left">What happens next?</h3>
          <div className="space-y-4">
            {[
              { icon: CheckCircle, label: 'Order Confirmed', done: true },
              { icon: Package, label: 'Being Packed & Quality Checked', done: false },
              { icon: Truck, label: 'Shipped & Out for Delivery', done: false },
              { icon: Home, label: 'Delivered to Your Doorstep', done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <step.icon size={16} />
                </div>
                <span className={`text-sm ${step.done ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 flex-col sm:flex-row">
          <Link
            href="/shop"
            className="flex-1 py-3 border border-maroon-500 text-maroon-500 hover:bg-maroon-50 rounded-lg text-sm font-semibold transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 bg-maroon-500 hover:bg-maroon-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center">Loading…</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}

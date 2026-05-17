'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Truck } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { BUSINESS } from '@/lib/config'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart()

  const tax = Math.round(subtotal * BUSINESS.taxRate * 100) / 100
  const estimatedTotal = Math.round((subtotal + tax) * 100) / 100

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center text-center px-4 py-20">
        <ShoppingBag size={64} className="text-gold-300 mb-6" />
        <h2 className="font-serif text-2xl font-bold text-maroon-500 mb-3">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm mb-8">Looks like you haven&apos;t added any jewellery yet.</p>
        <Link href="/shop" className="px-8 py-3 bg-maroon-500 hover:bg-maroon-600 text-white font-semibold text-sm rounded-lg transition-colors">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-beige border-b border-gold-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-maroon-500">Shopping Cart</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items */}
          <div className="flex-1 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <Link href={`/product/${product.slug}`} className="shrink-0">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-50">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <p className="text-xs text-gold-600 mb-0.5">{product.collection}</p>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 hover:text-maroon-500 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-400 mt-1">{product.metalType} · {product.purity} · {product.weight}</p>
                    </div>
                    <button onClick={() => removeFromCart(product.id)} className="self-start text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-0 border border-gold-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gold-50 text-gray-600 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold border-x border-gold-200">
                        {quantity}
                      </span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gold-50 text-gray-600 transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-base font-bold text-gray-900">
                      ${(product.price * quantity).toLocaleString('en-US')}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between mt-4">
              <Link href="/shop" className="flex items-center gap-2 text-sm text-maroon-500 hover:text-maroon-700 transition-colors">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="font-serif text-lg font-bold text-gray-800 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Confirmed after order</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax ({Math.round(BUSINESS.taxRate * 100)}%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <Truck size={14} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700">
                  Shipping cost will be confirmed via WhatsApp or email before your order is dispatched.
                </p>
              </div>

              <div className="border-t border-gold-100 mt-4 pt-4 space-y-1">
                <div className="flex justify-between font-bold text-base">
                  <span>Estimated Total</span>
                  <span className="text-maroon-500">${estimatedTotal.toLocaleString('en-US')}</span>
                </div>
                <p className="text-xs text-gray-400">+ shipping (confirmed separately)</p>
              </div>

              <Link href="/checkout"
                className="block mt-5 w-full py-3.5 bg-maroon-500 hover:bg-maroon-600 text-white font-semibold text-sm text-center rounded-lg transition-colors">
                Proceed to Checkout
              </Link>

              <div className="mt-4 text-xs text-gray-400 text-center space-y-1">
                <p>Secure checkout · BIS certified jewellery</p>
                <p>Free returns within 15 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

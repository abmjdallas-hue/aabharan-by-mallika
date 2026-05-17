'use client'

import { X, ShoppingBag, Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { isBuyable, getWhatsAppUrl } from '@/lib/whatsapp'

interface Props {
  product: Product
  onClose: () => void
}

export default function QuickViewModal({ product, onClose }: Props) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)
  const buyable = isBuyable(product)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
          <X size={16} />
        </button>

        <div className="flex flex-col sm:flex-row">
          <div className="relative sm:w-64 h-64 sm:h-auto shrink-0 bg-gray-50 rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none overflow-hidden">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>

          <div className="p-6 flex flex-col gap-3">
            <p className="text-xs text-gold-600 font-medium tracking-wide">{product.collection}</p>
            <h2 className="font-serif text-xl font-bold text-gray-900">{product.name}</h2>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-maroon-500">
                ${product.price.toLocaleString('en-US')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice.toLocaleString('en-US')}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 py-3 border-y border-gold-100 text-sm">
              <div><span className="text-gray-400">Metal:</span> <span className="font-medium">{product.metalType}</span></div>
              <div><span className="text-gray-400">Purity:</span> <span className="font-medium">{product.purity}</span></div>
              <div><span className="text-gray-400">Weight:</span> <span className="font-medium">{product.weight}</span></div>
              <div>
                <span className="text-gray-400">Stock:</span>{' '}
                <span className={`font-medium ${product.stockStatus === 'in_stock' ? 'text-green-600' : product.stockStatus === 'limited' ? 'text-orange-500' : 'text-red-500'}`}>
                  {product.stockStatus === 'in_stock' ? 'In Stock' : product.stockStatus === 'limited' ? 'Limited' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{product.description}</p>

            {!buyable && (
              <p className="text-xs text-gray-400 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                This item is available for enquiry only. Click below to chat with us on WhatsApp and we will arrange your purchase personally.
              </p>
            )}

            <div className="flex gap-3 mt-1">
              {buyable ? (
                <button
                  onClick={() => { addToCart(product); onClose() }}
                  className="flex-1 py-3 bg-maroon-500 hover:bg-maroon-600 text-white text-sm font-semibold rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
              ) : (
                <a
                  href={getWhatsAppUrl(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={16} /> Enquire on WhatsApp
                </a>
              )}

              <button
                onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`w-12 h-12 rounded flex items-center justify-center border transition-colors ${
                  inWishlist ? 'bg-maroon-50 border-maroon-300 text-maroon-500' : 'border-gray-200 text-gray-500 hover:border-maroon-300 hover:text-maroon-500'
                }`}
              >
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            <Link href={`/product/${product.slug}`} onClick={onClose}
              className="text-center text-xs text-maroon-500 hover:underline">
              View Full Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

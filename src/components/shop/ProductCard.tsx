'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Eye, MessageCircle } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useState } from 'react'
import QuickViewModal from './QuickViewModal'
import { isBuyable, getWhatsAppUrl } from '@/lib/whatsapp'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [quickView, setQuickView] = useState(false)
  const [added, setAdded] = useState(false)

  const inWishlist = isInWishlist(product.id)
  const buyable = isBuyable(product)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <>
      <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
        <Link href={`/product/${product.slug}`} className="block">
          {/* Image — primary + hover second image */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-500 ${
                product.gallery?.[1]
                  ? 'group-hover:opacity-0 group-hover:scale-105'
                  : 'group-hover:scale-105'
              }`}
            />
            {product.gallery?.[1] && (
              <Image
                src={product.gallery[1]}
                alt={`${product.name} — alternate view`}
                fill
                className="object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100"
              />
            )}
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discount > 0 && (
                <span className="bg-maroon-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  -{discount}%
                </span>
              )}
              {product.stockStatus === 'limited' && (
                <span className="bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">Limited</span>
              )}
              {!buyable && (
                <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">Enquire</span>
              )}
            </div>

            {/* Hover actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleWishlist}
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow transition-colors ${
                  inWishlist ? 'bg-maroon-500 text-white' : 'bg-white text-gray-600 hover:bg-maroon-50 hover:text-maroon-500'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); setQuickView(true) }}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-gray-600 hover:bg-gold-50 hover:text-gold-600 transition-colors"
                aria-label="Quick view"
              >
                <Eye size={14} />
              </button>
            </div>

            {product.stockStatus === 'out_of_stock' && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3 sm:p-4">
            <p className="text-xs text-gold-600 mb-1 font-medium">{product.collection}</p>
            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-maroon-500 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
            <p className="text-xs text-gray-400 mt-1">{product.metalType} · {product.purity} · {product.weight}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-base font-bold text-gray-900">
                ${product.price.toLocaleString('en-US')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.originalPrice.toLocaleString('en-US')}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Bottom button — buyable vs WhatsApp */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          {buyable ? (
            <button
              onClick={handleAddToCart}
              disabled={product.stockStatus === 'out_of_stock'}
              className={`w-full py-2.5 rounded text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                added
                  ? 'bg-green-500 text-white'
                  : product.stockStatus === 'out_of_stock'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-maroon-500 hover:bg-maroon-600 text-white'
              }`}
            >
              <ShoppingBag size={14} />
              {added ? 'Added!' : product.stockStatus === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
            </button>
          ) : (
            <a
              href={getWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white transition-colors"
            >
              <MessageCircle size={14} />
              Enquire on WhatsApp
            </a>
          )}
        </div>
      </div>

      {quickView && <QuickViewModal product={product} onClose={() => setQuickView(false)} />}
    </>
  )
}

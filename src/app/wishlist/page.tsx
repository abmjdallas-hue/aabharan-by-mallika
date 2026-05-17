'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/context/WishlistContext'
import ProductCard from '@/components/shop/ProductCard'

export default function WishlistPage() {
  const { items } = useWishlist()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center text-center px-4 py-20">
        <Heart size={64} className="text-gold-300 mb-6" />
        <h2 className="font-serif text-2xl font-bold text-maroon-500 mb-3">Your Wishlist is Empty</h2>
        <p className="text-gray-500 text-sm mb-8">Save pieces you love and find them easily later.</p>
        <Link
          href="/shop"
          className="px-8 py-3 bg-maroon-500 hover:bg-maroon-600 text-white font-semibold text-sm rounded-lg transition-colors"
        >
          Explore Jewellery
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-beige border-b border-gold-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-maroon-500">My Wishlist</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} saved {items.length === 1 ? 'piece' : 'pieces'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import ProductCard from '@/components/shop/ProductCard'
import { useProducts } from '@/context/ProductsContext'

export default function FeaturedProducts() {
  const { products } = useProducts()
  const featured = products.filter((p) => p.featured).slice(0, 8)

  return (
    <section className="py-14 sm:py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold-600 text-sm tracking-widest uppercase mb-2">Hand-Picked</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-500">Featured Jewellery</h2>
          </div>
          <Link href="/shop"
            className="text-sm font-medium text-maroon-500 hover:text-maroon-700 border-b border-maroon-500 pb-0.5 transition-colors hidden sm:block">
            View All →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No featured products yet. Mark products as featured in the admin dashboard.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link href="/shop"
            className="inline-block px-8 py-3 border border-maroon-500 text-maroon-500 hover:bg-maroon-500 hover:text-white rounded text-sm font-medium transition-colors">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

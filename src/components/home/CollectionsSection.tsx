import Image from 'next/image'
import Link from 'next/link'
import { collections } from '@/data/products'

export default function CollectionsSection() {
  return (
    <section className="py-14 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gold-600 text-sm tracking-widest uppercase mb-2">Curated for You</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-500">Our Collections</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((col, i) => (
            <Link
              key={col.name}
              href={`/shop?collection=${encodeURIComponent(col.name)}`}
              className={`group relative overflow-hidden rounded-xl ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="relative h-56 sm:h-64">
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-1">{col.name}</h3>
                <p className="text-gray-300 text-xs sm:text-sm">{col.description}</p>
                <span className="inline-block mt-3 text-xs text-gold-300 font-medium tracking-wide uppercase border-b border-gold-400 pb-0.5">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

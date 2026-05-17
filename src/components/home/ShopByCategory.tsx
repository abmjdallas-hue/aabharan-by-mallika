import Image from 'next/image'
import Link from 'next/link'
import { categories } from '@/data/products'

export default function ShopByCategory() {
  return (
    <section className="py-14 sm:py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gold-600 text-sm tracking-widest uppercase mb-2">Browse Our Range</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-500">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center gap-3"
            >
              <div className="relative w-full aspect-square rounded-full overflow-hidden bg-gold-50 border-2 border-transparent group-hover:border-gold-400 transition-all shadow-md group-hover:shadow-lg">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-maroon-500 transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-gray-400">{cat.count} items</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

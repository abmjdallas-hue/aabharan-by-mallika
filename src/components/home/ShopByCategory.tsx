import Link from 'next/link'
import { categories } from '@/data/products'

const CAT_COLORS: Record<string, [string, string]> = {
  Necklaces:       ['#7c2d12', '#450a0a'],
  Haram:           ['#78350f', '#451a03'],
  Earrings:        ['#92400e', '#78350f'],
  Bangles:         ['#881337', '#4c0519'],
  Rings:           ['#1e1b4b', '#0f172a'],
  Pendants:        ['#3b0764', '#4c1d95'],
  'Maang Tikka':   ['#064e3b', '#022c22'],
  Vaddanam:        ['#7c2d12', '#450a0a'],
  'Bridal Sets':   ['#881337', '#4c0519'],
  'Silver Articles':['#374151', '#111827'],
  Dori:            ['#78350f', '#451a03'],
  Boxes:           ['#1e3a5f', '#0f172a'],
}

export default function ShopByCategory() {
  return (
    <section className="py-14 sm:py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gold-600 text-sm tracking-widest uppercase mb-2">Browse Our Range</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-500">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const [from, to] = CAT_COLORS[cat.name] ?? ['#7c2d12', '#450a0a']
            return (
              <Link
                key={cat.name}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-3"
              >
                <div
                  className="relative w-full aspect-square rounded-full border-2 border-transparent group-hover:border-gold-400 transition-all shadow-md group-hover:shadow-lg flex items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                >
                  {/* Dot texture */}
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(246,201,14,0.5) 1px, transparent 0)',
                      backgroundSize: '16px 16px',
                    }}
                  />
                  <span className="relative font-serif text-2xl font-bold text-white/80 group-hover:text-gold-300 transition-colors select-none">
                    {cat.name[0]}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-maroon-500 transition-colors leading-tight">
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-400">{cat.count} items</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

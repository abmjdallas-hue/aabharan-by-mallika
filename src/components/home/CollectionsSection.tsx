import Link from 'next/link'
import Image from 'next/image'
import { collections } from '@/data/products'
import { supabaseAdmin } from '@/lib/supabase'

const GRADIENTS = [
  'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
  'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
  'linear-gradient(135deg, #7c2d12 0%, #450a0a 100%)',
  'linear-gradient(135deg, #3b0764 0%, #4c1d95 100%)',
  'linear-gradient(135deg, #881337 0%, #4c0519 100%)',
  'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
  'linear-gradient(135deg, #92400e 0%, #78350f 100%)',
  'linear-gradient(135deg, #374151 0%, #111827 100%)',
]

export default async function CollectionsSection() {
  const { data } = await supabaseAdmin.from('collection_images').select('name, image_url')
  const imageMap: Record<string, string> = {}
  ;(data ?? []).forEach((c: { name: string; image_url: string }) => {
    if (c.image_url) imageMap[c.name] = c.image_url
  })

  return (
    <section className="py-14 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gold-600 text-sm tracking-widest uppercase mb-2">Curated for You</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-500">Our Collections</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((col, i) => {
            const imgUrl = imageMap[col.name]
            return (
              <Link
                key={col.name}
                href={`/shop?collection=${encodeURIComponent(col.name)}`}
                className={`group relative overflow-hidden rounded-xl ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                <div
                  className="relative h-56 sm:h-64 flex items-end"
                  style={!imgUrl ? { background: GRADIENTS[i % GRADIENTS.length] } : undefined}
                >
                  {imgUrl && (
                    <Image
                      src={imgUrl}
                      alt={col.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {!imgUrl && (
                    <>
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(246,201,14,0.4) 1px, transparent 0)',
                          backgroundSize: '32px 32px',
                        }}
                      />
                      <div className="absolute top-4 right-4 w-16 h-16 rounded-full border border-gold-400/20 flex items-center justify-center">
                        <span className="font-serif text-2xl text-gold-300/40">{col.name[0]}</span>
                      </div>
                    </>
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-1">{col.name}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm">{col.description}</p>
                  <span className="inline-block mt-3 text-xs text-gold-300 font-medium tracking-wide uppercase border-b border-gold-400 pb-0.5">
                    Shop Now →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

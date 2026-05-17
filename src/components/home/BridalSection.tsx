import Image from 'next/image'
import Link from 'next/link'

export default function BridalSection() {
  return (
    <section className="py-14 sm:py-20 bg-maroon-500 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <p className="text-gold-300 text-sm tracking-widest uppercase mb-3">For Your Special Day</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
              The Perfect Bridal Collection
            </h2>
            <p className="text-maroon-100 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              From the sacred haldi ceremony to the grand reception, adorn yourself with jewellery
              that captures the essence of your love story. Our master artisans craft each bridal
              set with 22KT gold and precious stones, ensuring you shine on every occasion.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href="/shop?collection=Bridal+Collection"
                className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm rounded transition-all hover:shadow-lg"
              >
                Explore Bridal Sets
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-maroon-600 font-semibold text-sm rounded transition-all"
              >
                Book Consultation
              </Link>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4 max-w-md w-full">
            <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1614886137799-3a79e15b3c5f?w=400&q=80"
                alt="Bridal Jewellery"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden mt-8">
              <Image
                src="https://images.unsplash.com/photo-1573408301185-9519f94815b0?w=400&q=80"
                alt="Temple Jewellery"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

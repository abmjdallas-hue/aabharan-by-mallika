import Link from 'next/link'

export default function BridalSection() {
  return (
    <section className="py-14 sm:py-20 bg-maroon-500 text-white overflow-hidden relative">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(246,201,14,0.8) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />
      {/* Decorative circles */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-gold-400/20 opacity-30" />
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-gold-400/15 opacity-20" />
      <div className="absolute -left-16 bottom-0 w-48 h-48 rounded-full border border-white/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gold-300 text-sm tracking-widest uppercase mb-3">For Your Special Day</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
            The Perfect Bridal Collection
          </h2>
          {/* Gold divider */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-gold-400/50" />
            <span className="text-gold-400 text-lg">◆</span>
            <div className="h-px w-16 bg-gold-400/50" />
          </div>
          <p className="text-maroon-100 text-sm sm:text-base leading-relaxed mb-8">
            From the sacred haldi ceremony to the grand reception, adorn yourself with jewellery
            that captures the essence of your love story. Our master artisans craft each bridal
            set with 22KT gold and precious stones, ensuring you shine on every occasion.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
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
      </div>
    </section>
  )
}

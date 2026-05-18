import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Award, Heart, Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Aabharan by Mallika — a family-run Indian jewellery store in Frisco, TX specialising in BIS Hallmarked gold, diamond, silver and temple jewellery.',
  alternates: { canonical: 'https://aabharanbymallikausa.com/about' },
  openGraph: {
    title: 'About Aabharan by Mallika',
    description: 'Family-run Indian jewellery store in Frisco, TX. BIS Hallmarked gold, diamond, silver & temple jewellery.',
    url: 'https://aabharanbymallikausa.com/about',
  },
}

const values = [
  { icon: ShieldCheck, title: 'Certified Quality', desc: 'Every piece is BIS Hallmarked and certified for metal purity and gemstone authenticity.' },
  { icon: Award, title: 'Master Craftsmanship', desc: 'Crafted by artisans with decades of experience in traditional Indian jewellery-making techniques.' },
  { icon: Heart, title: 'Made with Love', desc: 'Each design is inspired by the stories of Indian women — their grace, strength, and celebrations.' },
  { icon: Users, title: 'Customer First', desc: 'We offer video shopping, custom designs, and a 15-day hassle-free return policy.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1573408301185-9519f94815b0?w=1200&q=80" alt="About Aabharan" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-center px-4">
          <div>
            <p className="text-gold-300 text-xs tracking-widest uppercase mb-3">Our Story</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">About Aabharan by Mallika</h1>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="section-label">Who We Are</p>
            <h2 className="section-title mb-5">A Legacy of Beauty and Trust</h2>
            <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              <p>
                Aabharan by Mallika was born from a deep passion for the timeless art of Indian jewellery-making. Founded by Mallika, a third-generation jeweller with roots in the goldsmithing traditions of Andhra Pradesh, our brand bridges centuries of craftsmanship with the sensibilities of the modern Indian woman.
              </p>
              <p>
                Every piece we create carries the whispers of tradition — the delicate filigree of temple jewellery, the bold opulence of antique gold, the refined sparkle of diamond settings. We believe jewellery is not merely an accessory; it is a legacy, a memory, a celebration.
              </p>
              <p>
                Today, Aabharan serves customers across India and the Indian diaspora in the USA, offering an unparalleled selection of BIS Hallmarked gold, certified diamond, and temple jewellery crafted with integrity and love.
              </p>
            </div>
          </div>
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80" alt="Our jewellery" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-beige py-14 sm:py-20 border-y border-gold-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="section-label">What We Stand For</p>
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <v.icon size={22} className="text-gold-600" />
                </div>
                <h3 className="font-serif font-semibold text-maroon-500 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 text-center px-4">
        <p className="section-label">Explore Our Work</p>
        <h2 className="section-title mb-5">Discover the Collection</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
          From everyday lightweight pieces to opulent bridal sets, every design is a story waiting to be worn.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/shop" className="btn-primary">Shop All Jewellery</Link>
          <Link href="/contact" className="btn-secondary">Contact Us</Link>
        </div>
      </section>
    </div>
  )
}

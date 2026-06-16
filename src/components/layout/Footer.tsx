import Link from 'next/link'
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react'
import { BUSINESS, fullAddress } from '@/lib/config'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="font-serif text-2xl font-bold text-gold-400 mb-1">Aabharan</div>
            <div className="text-xs text-gold-500 tracking-widest mb-4">by Mallika</div>
            <p className="text-sm text-gray-400 leading-relaxed">{BUSINESS.tagline}</p>
            <div className="flex gap-3 mt-5">
              {[
                { href: BUSINESS.instagram, label: 'Instagram', Icon: Instagram },
                { href: BUSINESS.facebook, label: 'Facebook', Icon: Facebook },
                { href: BUSINESS.youtube, label: 'YouTube', Icon: Youtube },
              ]
                .filter((s) => s.href)
                .map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gold-500/40 text-gray-300
                               transition-all duration-300 hover:bg-gold-500 hover:text-white hover:border-gold-500
                               hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(201,168,76,0.6)]
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                  >
                    <Icon size={18} />
                  </a>
                ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop All', href: '/shop' },
                { label: 'Bridal Collection', href: '/shop?collection=Bridal+Collection' },
                { label: 'New Arrivals', href: '/shop' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-gold-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Policies</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Privacy Policy', href: '/policies/privacy' },
                { label: 'Returns & Exchanges', href: '/policies/returns' },
                { label: 'Delivery Information', href: '/policies/delivery' },
                { label: 'Terms & Conditions', href: '/policies/terms' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-gold-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin size={16} className="text-gold-400 mt-0.5 shrink-0" />
                <span className="text-gray-400">{fullAddress}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={16} className="text-gold-400 shrink-0" />
                <a href={`tel:${BUSINESS.phoneRaw}`} className="text-gray-400 hover:text-gold-400 transition-colors">{BUSINESS.phone}</a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={16} className="text-gold-400 shrink-0" />
                <a href={`mailto:${BUSINESS.email}`} className="text-gray-400 hover:text-gold-400 transition-colors">{BUSINESS.email}</a>
              </li>
            </ul>
            <div className="mt-5 p-3 bg-gray-800 rounded text-xs text-gray-400">
              <strong className="text-gold-400">Store Hours:</strong><br />
              {BUSINESS.hoursOpen}<br />
              {BUSINESS.hoursClosed}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-gold-600">BIS Hallmarked</span>
            <span>•</span>
            <span className="text-gold-600">Certified Jewellery</span>
            <span>•</span>
            <span className="text-gold-600">Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

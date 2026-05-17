import Link from 'next/link'
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react'
import { BUSINESS, fullAddress, whatsappBaseUrl } from '@/lib/config'

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
            <div className="flex gap-4 mt-5">
              {BUSINESS.instagram && (
                <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-gold-400 transition-colors">
                  <Instagram size={20} />
                </a>
              )}
              {BUSINESS.facebook && (
                <a href={BUSINESS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-gold-400 transition-colors">
                  <Facebook size={20} />
                </a>
              )}
              {BUSINESS.youtube && (
                <a href={BUSINESS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-gold-400 transition-colors">
                  <Youtube size={20} />
                </a>
              )}
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

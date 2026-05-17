import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Returns & Exchanges — Aabharan by Mallika' }

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-beige border-b border-gold-200 py-10 text-center">
        <h1 className="font-serif text-3xl font-bold text-maroon-500">Returns &amp; Exchanges</h1>
        <p className="text-gray-500 text-sm mt-2">Last updated: May 2025</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">

        {/* Quick-reference table */}
        <div className="overflow-hidden rounded-2xl border border-gold-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-maroon-500 text-white">
                <th className="py-3 px-5 text-left font-semibold">Category</th>
                <th className="py-3 px-4 text-center font-semibold">Returns</th>
                <th className="py-3 px-4 text-center font-semibold">Exchange</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100">
              <tr className="bg-white">
                <td className="py-3 px-5 font-medium text-gray-800">
                  Gold Jewellery
                  <p className="text-xs text-gray-400 font-normal mt-0.5">
                    Necklaces, Harams, Earrings, Bangles, Rings, Pendants, Maang Tikka, Vaddanam, Bridal Sets
                  </p>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">Not Accepted</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Within 3 Days</span>
                </td>
              </tr>
              <tr className="bg-beige/40">
                <td className="py-3 px-5 font-medium text-gray-800">
                  Silver Articles, Dori &amp; Boxes
                  <p className="text-xs text-gray-400 font-normal mt-0.5">
                    All silver items, dori / thread jewellery, and gift boxes
                  </p>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">Not Accepted</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">Not Accepted</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Gold Exchange Policy */}
        <section>
          <h2 className="font-serif text-xl font-bold text-maroon-500 mb-3">Gold Jewellery — Exchange Policy</h2>
          <div className="bg-white rounded-xl border border-gold-200 p-5 space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>
              We offer a <strong>one-time exchange within 3 days</strong> of purchase for gold jewellery items.
              No cash refunds are provided under any circumstances.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600">
              <li>The item must be unused, undamaged, and in its original condition.</li>
              <li>Original invoice, packaging, and hallmark certificate must be presented.</li>
              <li>Items must not have been resized, altered, or repaired after purchase.</li>
              <li>Exchange is subject to the prevailing gold rate on the day of exchange; any price difference must be settled at that time.</li>
              <li>Exchange must be initiated in person at our store or via WhatsApp within the 3-day window.</li>
            </ul>
            <p className="text-gray-500 text-xs pt-1">
              Custom or made-to-order gold jewellery is <strong>not eligible</strong> for exchange.
            </p>
          </div>
        </section>

        {/* Silver / Dori / Boxes — No Exchange */}
        <section>
          <h2 className="font-serif text-xl font-bold text-maroon-500 mb-3">Silver Articles, Dori &amp; Boxes — No Return / No Exchange</h2>
          <div className="bg-white rounded-xl border border-gold-200 p-5 space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>
              All sales of Silver Articles, Dori (thread jewellery), and Boxes are <strong>final</strong>.
              We do not accept returns or exchanges for these categories once the order has been placed and dispatched.
            </p>
            <p className="text-gray-500 text-xs">
              If you receive a defective or incorrect item, please contact us within <strong>24 hours</strong> of delivery
              via WhatsApp or email with a photo of the item so we can assist you.
            </p>
          </div>
        </section>

        {/* How to initiate */}
        <section>
          <h2 className="font-serif text-xl font-bold text-maroon-500 mb-3">How to Initiate an Exchange</h2>
          <ol className="space-y-3">
            {[
              'Contact us via WhatsApp or email within your eligible window (3 days for gold).',
              'Share your order number / invoice and a photo of the item.',
              'Our team will confirm eligibility and guide you on the next steps.',
              "Bring the item to our store in Frisco, TX, or arrange a secure courier (customer's responsibility).",
              'Exchange is processed on the same day once the item is verified.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-maroon-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Contact */}
        <div className="bg-gold-50 border border-gold-200 rounded-xl p-5 text-sm text-gray-700">
          <p className="font-semibold text-maroon-500 mb-1">Questions?</p>
          <p>
            Reach us on{' '}
            <a href="https://wa.me/14699991342" target="_blank" rel="noopener noreferrer"
              className="text-green-600 font-medium hover:underline">WhatsApp</a>
            {' '}or email{' '}
            <a href="mailto:abmjdallas@gmail.com" className="text-maroon-500 hover:underline">abmjdallas@gmail.com</a>.
            We&apos;re open Tue – Sun, 12:00 noon – 7:30 pm.
          </p>
          <Link href="/contact" className="inline-block mt-2 text-maroon-500 hover:underline text-xs">
            View full contact details →
          </Link>
        </div>

      </div>
    </div>
  )
}

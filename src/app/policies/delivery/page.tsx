import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Delivery Information — Aabharan by Mallika' }

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-beige border-b border-gold-200 py-10 text-center">
        <h1 className="font-serif text-3xl font-bold text-maroon-500">Delivery Information</h1>
        <p className="text-gray-500 text-sm mt-2">Last updated: May 2025</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 prose prose-sm prose-headings:font-serif prose-headings:text-maroon-500">
        <h2>Shipping Options</h2>
        <div className="not-prose overflow-x-auto rounded-xl border border-gold-200">
          <table className="w-full text-sm">
            <thead className="bg-gold-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Zone</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Estimated Delivery</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Starting Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100">
              <tr>
                <td className="px-4 py-3">Texas</td>
                <td className="px-4 py-3">2–5 Business Days</td>
                <td className="px-4 py-3 font-medium">from $12</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Oklahoma, Louisiana, New Mexico, Arkansas, Colorado</td>
                <td className="px-4 py-3">3–6 Business Days</td>
                <td className="px-4 py-3 font-medium">from $20</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Rest of USA</td>
                <td className="px-4 py-3">4–7 Business Days</td>
                <td className="px-4 py-3 font-medium">from $30</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-green-700 font-medium">In-Store Pickup (Frisco, TX)</td>
                <td className="px-4 py-3">Same Day / Ready when notified</td>
                <td className="px-4 py-3 text-green-600 font-medium">Free</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="not-prose text-xs text-gray-500 mt-2 px-1">
          Live FedEx rates are calculated at checkout based on your ZIP code. Rates shown above are starting estimates.
        </p>

        <h2>Important Notes</h2>
        <ul>
          <li>All jewellery is shipped via FedEx in insured, tamper-proof packaging</li>
          <li>Signature may be required upon delivery for high-value orders</li>
          <li>Shipping cost and estimated delivery date are confirmed via WhatsApp or email before dispatch</li>
          <li>Orders are processed Tuesday – Sunday; no dispatch on Mondays</li>
          <li>Optional FedEx declared-value insurance is available at checkout</li>
        </ul>

        <h2>In-Store Pickup</h2>
        <p>
          Free pickup is available at our store: <strong>2469 Preston Rd, Frisco, TX 75034</strong>.
          Store hours: <strong>Tue – Sun, 12:00 noon – 7:30 pm</strong>. Closed on Mondays.
          We will notify you via WhatsApp or phone when your order is ready.
        </p>

        <h2>International Shipping</h2>
        <p>We currently ship within the United States only. For international inquiries, please contact us via WhatsApp or email and we will do our best to assist.</p>

        <h2>Order Tracking</h2>
        <p>Once your order is dispatched, you will receive a FedEx tracking number via email or WhatsApp so you can track your shipment in real time.</p>
      </div>
    </div>
  )
}

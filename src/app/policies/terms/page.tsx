import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Terms & Conditions' }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-beige border-b border-gold-200 py-10 text-center">
        <h1 className="font-serif text-3xl font-bold text-maroon-500">Terms & Conditions</h1>
        <p className="text-gray-500 text-sm mt-2">Last updated: January 2025</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 prose prose-sm prose-headings:font-serif prose-headings:text-maroon-500 prose-a:text-maroon-500">
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using the Aabharan by Mallika website, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.</p>
        <h2>2. Products & Pricing</h2>
        <p>All prices are listed in US Dollars (USD) and are exclusive of applicable sales tax unless stated otherwise. Prices are subject to change without notice. We reserve the right to refuse or cancel orders if products are incorrectly priced.</p>
        <h2>3. Orders</h2>
        <p>Order confirmation does not constitute acceptance. We reserve the right to cancel any order at any time for reasons including but not limited to product unavailability, payment issues, or suspected fraud.</p>
        <h2>4. Intellectual Property</h2>
        <p>All content on this website including designs, images, text, and logos are the property of Aabharan by Mallika. Unauthorised reproduction is strictly prohibited.</p>
        <h2>5. Limitation of Liability</h2>
        <p>Aabharan by Mallika shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services beyond the purchase price of the item in question.</p>
        <h2>6. Governing Law</h2>
        <p>These terms are governed by the laws of the State of Texas, USA. Any disputes shall be subject to the exclusive jurisdiction of the courts in Collin County, Texas.</p>
        <h2>7. Changes to Terms</h2>
        <p>We reserve the right to update these terms at any time. Continued use of the website constitutes acceptance of the updated terms.</p>
        <h2>8. Contact</h2>
        <p>For any questions regarding these terms, contact us at abmjdallas@gmail.com.</p>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-beige border-b border-gold-200 py-10 text-center">
        <h1 className="font-serif text-3xl font-bold text-maroon-500">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mt-2">Last updated: January 2025</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 prose prose-sm prose-headings:font-serif prose-headings:text-maroon-500 prose-a:text-maroon-500">
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us when you create an account, place an order, or contact us. This includes your name, email address, phone number, shipping address, and payment information.</p>
        <h2>2. How We Use Your Information</h2>
        <p>We use your information to process orders, communicate with you about your purchases, send promotional materials (with your consent), and improve our services.</p>
        <h2>3. Information Sharing</h2>
        <p>We do not sell or share your personal information with third parties except as necessary to fulfil your orders (e.g., shipping partners) or as required by law.</p>
        <h2>4. Data Security</h2>
        <p>We implement industry-standard security measures to protect your personal information. Payment data is encrypted and processed securely via Stripe.</p>
        <h2>5. Cookies</h2>
        <p>We use cookies to enhance your browsing experience, remember your cart items, and analyse website traffic. You may disable cookies in your browser settings.</p>
        <h2>6. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal information. Contact us at hello@aabharan.com to exercise these rights.</p>
        <h2>7. Contact</h2>
        <p>For privacy-related enquiries, please contact us at hello@aabharan.com or write to us at our store address.</p>
      </div>
    </div>
  )
}

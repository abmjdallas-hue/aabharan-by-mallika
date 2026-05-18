import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { ProductsProvider } from '@/context/ProductsContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { Toaster } from 'react-hot-toast'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import FestivalBanner from '@/components/home/FestivalBanner'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const BASE_URL = 'https://aabharanbymallikausa.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Aabharan by Mallika — Luxury Indian Jewellery in Frisco, TX',
    template: '%s | Aabharan by Mallika',
  },
  description:
    'Discover BIS Hallmarked gold, diamond, silver & temple jewellery at Aabharan by Mallika in Frisco, Texas. Bridal sets, antique designs, lightweight everyday pieces — shop online or visit us.',
  keywords: [
    'Indian jewellery Frisco TX',
    'gold jewellery Dallas',
    'bridal jewellery Texas',
    'temple jewellery USA',
    'diamond jewellery Frisco',
    'antique jewellery Dallas',
    'silver jewellery',
    'Aabharan by Mallika',
    'BIS hallmarked gold',
  ],
  authors: [{ name: 'Aabharan by Mallika' }],
  creator: 'Aabharan by Mallika',
  publisher: 'Aabharan by Mallika',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    siteName: 'Aabharan by Mallika',
    locale: 'en_US',
    url: BASE_URL,
    title: 'Aabharan by Mallika — Luxury Indian Jewellery in Frisco, TX',
    description:
      'BIS Hallmarked gold, diamond & temple jewellery. Bridal sets, antique designs and lightweight everyday pieces — shop online or visit our Frisco, TX store.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aabharan by Mallika — Luxury Indian Jewellery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aabharan by Mallika — Luxury Indian Jewellery in Frisco, TX',
    description:
      'BIS Hallmarked gold, diamond & temple jewellery. Shop online or visit our Frisco, TX store.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: BASE_URL,
  },
  other: {
    'theme-color': '#8B1A1A',
  },
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'JewelryStore',
  name: 'Aabharan by Mallika',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  image: `${BASE_URL}/og-image.jpg`,
  description:
    'BIS Hallmarked gold, diamond, silver and temple jewellery store in Frisco, Texas. Specialising in bridal sets, antique designs and lightweight everyday jewellery.',
  telephone: '+1-469-000-0000',
  email: 'abmjdallas@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Frisco',
    addressRegion: 'TX',
    postalCode: '75034',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 33.1581,
    longitude: -96.8223,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '12:00',
      closes: '19:30',
    },
  ],
  priceRange: '$$$',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Cash, Credit Card, Zelle',
  sameAs: [],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <GoogleAnalytics />
        <AuthProvider>
        <ProductsProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 2000,
                style: { fontSize: '14px' },
              }}
            />
            <AnnouncementBar />
            <FestivalBanner />
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
          </WishlistProvider>
        </CartProvider>
        </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

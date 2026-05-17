import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: {
    default: 'Aabharan by Mallika — Luxury Indian Jewellery',
    template: '%s | Aabharan by Mallika',
  },
  description:
    'Discover exquisite BIS Hallmarked gold, diamond and temple jewellery. Bridal sets, antique designs and lightweight everyday jewellery crafted for the modern Indian woman.',
  keywords: ['jewellery', 'gold jewellery', 'bridal jewellery', 'temple jewellery', 'diamond jewellery', 'Indian jewellery'],
  openGraph: {
    siteName: 'Aabharan by Mallika',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
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

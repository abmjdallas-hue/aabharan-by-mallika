import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop — All Jewellery',
  description:
    'Browse our full collection of BIS Hallmarked gold, diamond, silver and temple jewellery. Filter by category, collection, metal type and price.',
  alternates: { canonical: 'https://aabharanbymallikausa.com/shop' },
  openGraph: {
    title: 'Shop — Aabharan by Mallika',
    description: 'Browse gold, diamond, silver & temple jewellery. BIS Hallmarked pieces for every occasion.',
    url: 'https://aabharanbymallikausa.com/shop',
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from 'next'
import { products as staticProducts } from '@/data/products'
import ProductPageClient from './ProductPageClient'

export const revalidate = 3600

const BASE_URL = 'https://aabharanbymallikausa.com'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const product = staticProducts.find((p) => p.slug === slug)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  const title = `${product.name} — ${product.category}`
  const description = `${product.description.slice(0, 155)}…`
  const url = `${BASE_URL}/product/${product.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
  }
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ProductPageClient params={params} />
}

export async function generateStaticParams() {
  return staticProducts.map((p) => ({ slug: p.slug }))
}

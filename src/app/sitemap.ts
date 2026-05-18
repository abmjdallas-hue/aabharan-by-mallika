import { MetadataRoute } from 'next'
import { products as staticProducts } from '@/data/products'

const BASE_URL = 'https://aabharanbymallikausa.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/policies/returns`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/policies/delivery`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/policies/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  const productPages: MetadataRoute.Sitemap = staticProducts.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...productPages]
}

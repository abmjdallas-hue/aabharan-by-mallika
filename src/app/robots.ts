import { MetadataRoute } from 'next'

const BASE_URL = 'https://aabharanbymallikausa.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/checkout/', '/cart/', '/order-success/', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}

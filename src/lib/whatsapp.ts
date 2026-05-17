import { Product, BUYABLE_CATEGORIES } from '@/types'
import { BUSINESS } from './config'

export function isBuyable(product: Product): boolean {
  return BUYABLE_CATEGORIES.includes(product.category)
}

export function getWhatsAppUrl(product: Product): string {
  const message = `Hi! I'm interested in:\n\n*${product.name}*\nPrice: $${product.price.toLocaleString('en-US')}\nMetal: ${product.metalType} · ${product.purity}\nWeight: ${product.weight}\n\nCould you please provide more details and availability?`
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`
}

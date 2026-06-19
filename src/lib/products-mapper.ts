import { Product, Category, Collection, SilverSubcategory } from '@/types'

// ── Supabase row → Product ────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToProduct(r: any): Product {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    category: r.category as Category,
    subcategory: r.subcategory as SilverSubcategory | undefined,
    collection: r.collection as Collection,
    price: r.price,
    originalPrice: r.original_price ?? undefined,
    image: r.image,
    gallery: r.gallery ?? [],
    description: r.description,
    metalType: r.metal_type,
    weight: r.weight,
    purity: r.purity,
    stockStatus: r.stock_status as Product['stockStatus'],
    featured: r.featured,
    sku: r.sku ?? undefined,
    tags: r.tags ?? [],
  }
}

// ── Product → Supabase row (full insert) ──────────────────────────────────────
export function productToRow(p: Omit<Product, 'id'> & { id?: string }) {
  return {
    ...(p.id ? { id: p.id } : {}),
    name: p.name,
    slug: p.slug,
    category: p.category,
    subcategory: p.subcategory ?? null,
    collection: p.collection,
    price: p.price,
    original_price: p.originalPrice ?? null,
    image: p.image,
    gallery: p.gallery,
    description: p.description,
    metal_type: p.metalType,
    weight: p.weight,
    purity: p.purity,
    stock_status: p.stockStatus,
    featured: p.featured,
    sku: p.sku ?? null,
    tags: p.tags ?? [],
  }
}

// ── Partial Product updates → snake_case row (patch) ──────────────────────────
export function productUpdatesToRow(updates: Partial<Product>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (updates.name !== undefined) row.name = updates.name
  if (updates.slug !== undefined) row.slug = updates.slug
  if (updates.category !== undefined) row.category = updates.category
  if (updates.subcategory !== undefined) row.subcategory = updates.subcategory ?? null
  if (updates.collection !== undefined) row.collection = updates.collection
  if (updates.price !== undefined) row.price = updates.price
  if (updates.originalPrice !== undefined) row.original_price = updates.originalPrice ?? null
  if (updates.image !== undefined) row.image = updates.image
  if (updates.gallery !== undefined) row.gallery = updates.gallery
  if (updates.description !== undefined) row.description = updates.description
  if (updates.metalType !== undefined) row.metal_type = updates.metalType
  if (updates.weight !== undefined) row.weight = updates.weight
  if (updates.purity !== undefined) row.purity = updates.purity
  if (updates.stockStatus !== undefined) row.stock_status = updates.stockStatus
  if (updates.featured !== undefined) row.featured = updates.featured
  if (updates.sku !== undefined) row.sku = updates.sku ?? null
  if (updates.tags !== undefined) row.tags = updates.tags
  return row
}

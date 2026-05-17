'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Product, Category, Collection, SilverSubcategory } from '@/types'
import { products as staticProducts } from '@/data/products'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface ProductsContextType {
  products: Product[]
  loading: boolean
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  getProduct: (slug: string) => Product | undefined
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

const STORAGE_KEY = 'aabharan-products'

// ── Supabase row → Product ────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(r: any): Product {
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

// ── Product → Supabase row ────────────────────────────────────────────────────
function productToRow(p: Omit<Product, 'id'> & { id?: string }) {
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

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticProducts)
  const [loading, setLoading] = useState(false)
  const [localLoaded, setLocalLoaded] = useState(false)

  useEffect(() => {
    if (isSupabaseConfigured) {
      // ── Supabase mode: fetch products from database ──────────────────────
      setLoading(true)
      supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setProducts(data.map(rowToProduct))
          }
          // If table is empty, keep static products so the shop isn't blank
          setLoading(false)
        })
    } else {
      // ── localStorage mode ────────────────────────────────────────────────
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed)
        } catch {}
      }
      setLocalLoaded(true)
    }
  }, [])

  // Persist to localStorage when in localStorage mode
  useEffect(() => {
    if (!isSupabaseConfigured && localLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    }
  }, [products, localLoaded])

  // ── addProduct ────────────────────────────────────────────────────────────
  const addProduct = async (data: Omit<Product, 'id'>): Promise<Product> => {
    const id = `p_${Date.now()}`
    const newProduct: Product = { ...data, id }

    if (isSupabaseConfigured) {
      const { data: row, error } = await supabase
        .from('products')
        .insert(productToRow({ ...data, id }))
        .select()
        .single()
      if (error) throw new Error(error.message)
      const saved = rowToProduct(row)
      setProducts((prev) => [saved, ...prev])
      return saved
    }

    setProducts((prev) => [newProduct, ...prev])
    return newProduct
  }

  // ── updateProduct ─────────────────────────────────────────────────────────
  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    if (isSupabaseConfigured) {
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

      const { error } = await supabase.from('products').update(row).eq('id', id)
      if (error) throw new Error(error.message)
    }

    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  // ── deleteProduct ─────────────────────────────────────────────────────────
  const deleteProduct = async (id: string): Promise<void> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw new Error(error.message)
    }
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const getProduct = (slug: string) => products.find((p) => p.slug === slug)

  return (
    <ProductsContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, getProduct }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}

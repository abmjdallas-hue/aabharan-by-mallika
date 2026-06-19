'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Product } from '@/types'
import { products as staticProducts } from '@/data/products'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { rowToProduct } from '@/lib/products-mapper'

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

// Fetch wrapper that attaches the logged-in admin's Supabase access token so the
// server-side route can verify the caller is an admin before writing.
async function adminFetch(url: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed (${res.status})`)
  }
  return res
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticProducts)
  const [loading, setLoading] = useState(isSupabaseConfigured)
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
    // products.id is a NOT NULL text column with no default, so we generate the
    // `p_<timestamp>` id ourselves.
    const id = `p_${Date.now()}`
    const newProduct: Product = { ...data, id }

    if (isSupabaseConfigured) {
      const res = await adminFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(newProduct),
      })
      const saved: Product = await res.json()
      setProducts((prev) => [saved, ...prev])
      return saved
    }

    setProducts((prev) => [newProduct, ...prev])
    return newProduct
  }

  // ── updateProduct ─────────────────────────────────────────────────────────
  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    if (isSupabaseConfigured) {
      await adminFetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      })
    }

    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  // ── deleteProduct ─────────────────────────────────────────────────────────
  const deleteProduct = async (id: string): Promise<void> => {
    if (isSupabaseConfigured) {
      await adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' })
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

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Product } from '@/types'

interface WishlistContextType {
  items: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('aabharan-wishlist')
    if (saved) {
      try { setItems(JSON.parse(saved)) } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('aabharan-wishlist', JSON.stringify(items))
  }, [items])

  const addToWishlist = (product: Product) => {
    setItems(prev => prev.find(p => p.id === product.id) ? prev : [...prev, product])
  }

  const removeFromWishlist = (id: string) => {
    setItems(prev => prev.filter(p => p.id !== id))
  }

  const isInWishlist = (id: string) => items.some(p => p.id === id)

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, totalItems: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

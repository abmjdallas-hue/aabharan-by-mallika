'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { useProducts } from '@/context/ProductsContext'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { products } = useProducts()

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return }
    const q = query.toLowerCase()
    setResults(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.includes(q))
      ).slice(0, 6)
    )
  }, [query, products])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute top-0 left-0 right-0 bg-white shadow-xl">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 border-b border-gold-200 pb-3">
            <Search size={20} className="text-gold-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jewellery, collections, categories…"
              className="flex-1 outline-none text-base text-gray-800 bg-transparent placeholder-gray-400"
            />
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>

          {results.length > 0 && (
            <ul className="py-3 space-y-1 max-h-80 overflow-y-auto">
              {results.map((product) => (
                <li key={product.id}>
                  <Link href={`/product/${product.slug}`} onClick={onClose}
                    className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gold-50 transition-colors">
                    <div className="w-12 h-12 relative rounded overflow-hidden shrink-0 bg-gray-100">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        {product.category} · ${product.price.toLocaleString('en-US')}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {query.length >= 2 && results.length === 0 && (
            <p className="py-6 text-center text-sm text-gray-500">No results found for &quot;{query}&quot;</p>
          )}

          {query.length < 2 && (
            <div className="py-4 text-sm text-gray-400 text-center">Start typing to search our jewellery…</div>
          )}
        </div>
      </div>
    </div>
  )
}

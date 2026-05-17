'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FilterState, Product } from '@/types'
import ProductCard from '@/components/shop/ProductCard'
import ProductFilters from '@/components/shop/ProductFilters'
import { SlidersHorizontal } from 'lucide-react'
import { useProducts } from '@/context/ProductsContext'

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  collections: [],
  subcategories: [],
  priceRange: [0, 10000],
  sortBy: 'default',
  search: '',
}

function ShopContent() {
  const params = useSearchParams()
  const { products } = useProducts()
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [filtered, setFiltered] = useState<Product[]>(products)

  useEffect(() => {
    const category = params.get('category')
    const collection = params.get('collection')
    setFilters((prev) => ({
      ...prev,
      categories: category ? [category] : [],
      collections: collection ? [collection] : [],
    }))
  }, [params])

  useEffect(() => {
    let result = [...products]
    if (filters.categories.length > 0) result = result.filter((p) => filters.categories.includes(p.category))
    if (filters.subcategories.length > 0) result = result.filter((p) => p.subcategory && filters.subcategories.includes(p.subcategory))
    if (filters.collections.length > 0) result = result.filter((p) => filters.collections.includes(p.collection))
    result = result.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    }
    switch (filters.sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break
      case 'price_desc': result.sort((a, b) => b.price - a.price); break
      case 'name_asc': result.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'name_desc': result.sort((a, b) => b.name.localeCompare(a.name)); break
    }
    setFiltered(result)
  }, [filters, products])

  const activeFilterCount = filters.categories.length + filters.collections.length

  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-beige border-b border-gold-200 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-500">Shop All Jewellery</h1>
          <p className="text-gray-500 text-sm mt-2">{filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'} found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gold-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gold-50 transition-colors relative"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-maroon-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <label className="text-sm text-gray-600 hidden sm:block">Sort by:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value as FilterState['sortBy'] }))}
              className="border border-gold-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-maroon-400 bg-white"
            >
              <option value="default">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <ProductFilters filters={filters} onChange={setFilters} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
              <p className="text-gray-400 text-lg mb-4">No jewellery found</p>
              <button onClick={() => setFilters(DEFAULT_FILTERS)} className="text-sm text-maroon-500 hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              <ProductFilters filters={filters} onChange={setFilters} onClose={() => setMobileFiltersOpen(false)} />
            </div>
            <div className="sticky bottom-0 p-4 bg-white border-t border-gold-100">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-maroon-500 text-white rounded-lg text-sm font-semibold"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center text-gray-400">Loading…</div>}>
      <ShopContent />
    </Suspense>
  )
}

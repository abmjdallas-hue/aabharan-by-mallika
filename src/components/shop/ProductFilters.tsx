'use client'

import { FilterState, Category, Collection, SILVER_SUBCATEGORIES } from '@/types'
import { X } from 'lucide-react'

const CATEGORIES: Category[] = [
  'Necklaces', 'Haram', 'Earrings', 'Bangles', 'Rings',
  'Pendants', 'Maang Tikka', 'Vaddanam', 'Bridal Sets', 'Silver Articles', 'Dori', 'Boxes',
]

const COLLECTIONS: Collection[] = [
  'Antique Jewellery', 'Diamond Jewellery', 'Gold Jewellery',
  'Temple Jewellery', 'Bridal Collection', 'Lightweight Jewellery', 'Festive Collection',
]

interface Props {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onClose?: () => void
}

export default function ProductFilters({ filters, onChange, onClose }: Props) {
  const toggle = (key: 'categories' | 'collections' | 'subcategories', value: string) => {
    const current = filters[key]
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    // Clearing Silver Articles also clears its subcategories
    if (key === 'categories' && value === 'Silver Articles' && filters.categories.includes('Silver Articles')) {
      onChange({ ...filters, categories: next, subcategories: [] })
    } else {
      onChange({ ...filters, [key]: next })
    }
  }

  const clearAll = () => {
    onChange({ categories: [], collections: [], subcategories: [], priceRange: [0, 10000], sortBy: 'default', search: '' })
  }

  const silverSelected = filters.categories.includes('Silver Articles')
  const hasFilters = filters.categories.length > 0 || filters.collections.length > 0 || filters.subcategories.length > 0

  return (
    <aside className="bg-white rounded-xl border border-gold-100 shadow-sm p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-semibold text-gray-800">Filters</h3>
        <div className="flex gap-3">
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-maroon-500 hover:underline">
              Clear All
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-gray-400 lg:hidden">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggle('categories', cat)}
                className="w-4 h-4 rounded border-gray-300 text-maroon-500 focus:ring-maroon-400"
              />
              <span className="text-sm text-gray-700 group-hover:text-maroon-500 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Silver Articles subcategories — only visible when Silver Articles is checked */}
      {silverSelected && (
        <div className="pl-3 border-l-2 border-gold-200">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Silver Article Type</h4>
          <div className="space-y-2">
            {SILVER_SUBCATEGORIES.map((sub) => (
              <label key={sub} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.subcategories.includes(sub)}
                  onChange={() => toggle('subcategories', sub)}
                  className="w-4 h-4 rounded border-gray-300 text-gold-600 focus:ring-gold-400"
                />
                <span className="text-sm text-gray-600 group-hover:text-maroon-500 transition-colors">{sub}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Collections */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Collection</h4>
        <div className="space-y-2">
          {COLLECTIONS.map((col) => (
            <label key={col} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.collections.includes(col)}
                onChange={() => toggle('collections', col)}
                className="w-4 h-4 rounded border-gray-300 text-maroon-500 focus:ring-maroon-400"
              />
              <span className="text-sm text-gray-700 group-hover:text-maroon-500 transition-colors">{col}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range — USD */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Price Range</h4>
        <div className="space-y-2">
          {[
            { label: 'Under $500', range: [0, 500] as [number, number] },
            { label: '$500 – $1,000', range: [500, 1000] as [number, number] },
            { label: '$1,000 – $2,000', range: [1000, 2000] as [number, number] },
            { label: '$2,000 – $4,000', range: [2000, 4000] as [number, number] },
            { label: 'Above $4,000', range: [4000, 10000] as [number, number] },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={filters.priceRange[0] === opt.range[0] && filters.priceRange[1] === opt.range[1]}
                onChange={() => onChange({ ...filters, priceRange: opt.range })}
                className="w-4 h-4 border-gray-300 text-maroon-500 focus:ring-maroon-400"
              />
              <span className="text-sm text-gray-700 group-hover:text-maroon-500 transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}

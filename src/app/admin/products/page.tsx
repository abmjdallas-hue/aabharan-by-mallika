'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Pencil, Trash2, Search, ChevronLeft, RefreshCw } from 'lucide-react'
import { useProducts } from '@/context/ProductsContext'

export default function AdminProductsPage() {
  const { products, deleteProduct } = useProducts()
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.collection.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  )

  const handleDelete = async (id: string) => {
    await deleteProduct(id)
    setDeleteId(null)
  }

  const resetToDefaults = () => {
    localStorage.removeItem('aabharan-products')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <div className="font-serif text-xl font-bold text-gold-400">Aabharan Admin</div>
          <div className="text-xs text-gray-400">Manage Products</div>
        </div>
        <Link href="/admin" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
          <ChevronLeft size={14} /> Dashboard
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
            <p className="text-sm text-gray-500 mt-0.5">{products.length} total · {filtered.length} shown</p>
          </div>
          <div className="flex gap-3">
            <button onClick={resetToDefaults} title="Reset to default sample products"
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-100 transition-colors">
              <RefreshCw size={14} /> Reset
            </button>
            <Link href="/admin/products/new"
              className="flex items-center gap-2 px-4 py-2 bg-maroon-500 hover:bg-maroon-600 text-white text-sm font-semibold rounded-lg transition-colors">
              <PlusCircle size={16} /> Add New Product
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, collection, or SKU…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-maroon-400 bg-white" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase w-14">Photo</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase hidden lg:table-cell">Metal / Purity</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase hidden lg:table-cell">Weight</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Price</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Stock</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800 line-clamp-1 max-w-[200px]">{product.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{product.sku || 'No SKU'}</div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full font-medium">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-600">
                      {product.metalType} · {product.purity}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-600">{product.weight}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-semibold text-gray-900">${product.price.toLocaleString('en-US')}</div>
                      {product.originalPrice && (
                        <div className="text-xs text-gray-400 line-through">${product.originalPrice.toLocaleString('en-US')}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                        product.stockStatus === 'in_stock' ? 'bg-green-100 text-green-700' :
                        product.stockStatus === 'limited' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {product.stockStatus === 'in_stock' ? 'In Stock' : product.stockStatus === 'limited' ? 'Limited' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/products/${product.id}`}
                          className="p-1.5 text-gray-400 hover:text-maroon-500 hover:bg-maroon-50 rounded transition-colors" title="Edit">
                          <Pencil size={14} />
                        </Link>
                        <button onClick={() => setDeleteId(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-400">No products found</p>
              {search && (
                <button onClick={() => setSearch('')} className="mt-2 text-xs text-maroon-500 hover:underline">Clear search</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-gray-800 mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 mb-1">
              You are about to permanently delete:
            </p>
            <p className="text-sm font-semibold text-maroon-500 mb-5">
              &quot;{products.find((p) => p.id === deleteId)?.name}&quot;
            </p>
            <p className="text-xs text-gray-400 mb-5">This will remove it from the store immediately. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

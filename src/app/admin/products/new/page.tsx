'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Save, CheckCircle } from 'lucide-react'
import { Category, Collection, SilverSubcategory, SILVER_SUBCATEGORIES } from '@/types'
import { useProducts } from '@/context/ProductsContext'

const CATEGORIES: Category[] = [
  'Necklaces', 'Haram', 'Earrings', 'Bangles', 'Rings',
  'Pendants', 'Maang Tikka', 'Vaddanam', 'Bridal Sets', 'Silver Articles', 'Dori', 'Boxes',
]

const COLLECTIONS: Collection[] = [
  'Antique Jewellery', 'Diamond Jewellery', 'Gold Jewellery',
  'Temple Jewellery', 'Bridal Collection', 'Lightweight Jewellery', 'Festive Collection',
]

const EMPTY_FORM = {
  name: '', slug: '', category: '' as Category | '',
  subcategory: '' as SilverSubcategory | '',
  collection: '' as Collection | '',
  price: '', originalPrice: '',
  image: '', gallery: '',
  description: '', metalType: '', weight: '', purity: '',
  stockStatus: 'in_stock' as 'in_stock' | 'out_of_stock' | 'limited',
  featured: false, sku: '',
}

export default function NewProductPage() {
  const router = useRouter()
  const { addProduct } = useProducts()
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: keyof typeof EMPTY_FORM, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setForm((f) => ({ ...f, name, slug }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Product name is required'
    if (!form.category) e.category = 'Category is required'
    if (!form.collection) e.collection = 'Collection is required'
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price is required'
    if (!form.image.trim()) e.image = 'Image URL is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.metalType) e.metalType = 'Metal type is required'
    if (!form.purity) e.purity = 'Purity is required'
    if (!form.weight.trim()) e.weight = 'Weight is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)

    const galleryArr = form.gallery
      ? form.gallery.split('\n').map((u) => u.trim()).filter(Boolean)
      : [form.image]

    await addProduct({
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: form.category as Category,
      subcategory: form.category === 'Silver Articles' && form.subcategory ? form.subcategory as SilverSubcategory : undefined,
      collection: form.collection as Collection,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      image: form.image,
      gallery: galleryArr,
      description: form.description,
      metalType: form.metalType,
      weight: form.weight,
      purity: form.purity,
      stockStatus: form.stockStatus,
      featured: form.featured,
      sku: form.sku || undefined,
      tags: [],
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => router.push('/admin/products'), 1200)
  }

  if (saved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
          <p className="text-lg font-semibold text-gray-800">Product Added!</p>
          <p className="text-sm text-gray-500 mt-1">Redirecting to products list…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <div className="font-serif text-xl font-bold text-gold-400">Aabharan Admin</div>
          <div className="text-xs text-gray-400">Add New Product</div>
        </div>
        <Link href="/admin/products" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
          <ChevronLeft size={14} /> Back to Products
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Basic Information</h2>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Product Name *</label>
              <input type="text" value={form.name} onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Royal Kundan Bridal Necklace" className="input-field" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">URL Slug (auto-filled)</label>
              <input type="text" value={form.slug} onChange={(e) => set('slug', e.target.value)}
                className="input-field font-mono text-xs text-gray-500" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Product Description *</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
                rows={4} placeholder="Describe the jewellery piece — materials, design, occasion…"
                className="input-field resize-none" />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">SKU / Item Code</label>
              <input type="text" value={form.sku} onChange={(e) => set('sku', e.target.value)}
                placeholder="ABM-NK-017" className="input-field" />
            </div>
          </section>

          {/* Pricing */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Pricing (USD)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Selling Price ($) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="number" min="0" step="0.01" value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    placeholder="1200.00" className="input-field pl-7" />
                </div>
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Original / Compare Price ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="number" min="0" step="0.01" value={form.originalPrice}
                    onChange={(e) => set('originalPrice', e.target.value)}
                    placeholder="1500.00" className="input-field pl-7" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Leave blank if no discount</p>
              </div>
            </div>
          </section>

          {/* Category */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Categorisation</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Category *</label>
                <select value={form.category} onChange={(e) => { set('category', e.target.value); set('subcategory', '') }} className="input-field">
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Collection *</label>
                <select value={form.collection} onChange={(e) => set('collection', e.target.value)} className="input-field">
                  <option value="">Select Collection</option>
                  {COLLECTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.collection && <p className="text-xs text-red-500 mt-1">{errors.collection}</p>}
              </div>
            </div>

            {form.category === 'Silver Articles' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Silver Article Type</label>
                <select value={form.subcategory} onChange={(e) => set('subcategory', e.target.value)} className="input-field">
                  <option value="">Select type (optional)</option>
                  {SILVER_SUBCATEGORIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-1">Helps customers filter within Silver Articles</p>
              </div>
            )}
          </section>

          {/* Jewellery Details */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Jewellery Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Metal Type *</label>
                <select value={form.metalType} onChange={(e) => set('metalType', e.target.value)} className="input-field">
                  <option value="">Select</option>
                  <option>Gold</option>
                  <option>White Gold</option>
                  <option>Rose Gold</option>
                  <option>Silver</option>
                  <option>Platinum</option>
                </select>
                {errors.metalType && <p className="text-xs text-red-500 mt-1">{errors.metalType}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Purity *</label>
                <select value={form.purity} onChange={(e) => set('purity', e.target.value)} className="input-field">
                  <option value="">Select</option>
                  <option>24 KT</option>
                  <option>22 KT</option>
                  <option>18 KT</option>
                  <option>14 KT</option>
                  <option>10 KT</option>
                  <option>925 Sterling</option>
                  <option>950 Platinum</option>
                </select>
                {errors.purity && <p className="text-xs text-red-500 mt-1">{errors.purity}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Weight *</label>
                <input type="text" value={form.weight} onChange={(e) => set('weight', e.target.value)}
                  placeholder="e.g. 42g" className="input-field" />
                {errors.weight && <p className="text-xs text-red-500 mt-1">{errors.weight}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Stock Status *</label>
                <select value={form.stockStatus} onChange={(e) => set('stockStatus', e.target.value)} className="input-field">
                  <option value="in_stock">In Stock</option>
                  <option value="limited">Limited Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="featured" checked={form.featured}
                  onChange={(e) => set('featured', e.target.checked)}
                  className="w-4 h-4 text-maroon-500 rounded" />
                <label htmlFor="featured" className="text-sm text-gray-700 font-medium cursor-pointer">
                  Show on Homepage (Featured)
                </label>
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Images</h2>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Main Image URL *</label>
              <input type="url" value={form.image} onChange={(e) => set('image', e.target.value)}
                placeholder="https://res.cloudinary.com/… or /images/your-photo.jpg"
                className="input-field" />
              {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
              <p className="text-xs text-gray-400 mt-1">Use Cloudinary URL or put image in /public/images/ and use /images/filename.jpg</p>
              {form.image && (
                <div className="mt-3 w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Additional Gallery URLs</label>
              <textarea value={form.gallery} onChange={(e) => set('gallery', e.target.value)}
                rows={3} placeholder="One URL per line (different angles of the same piece)"
                className="input-field resize-none text-xs" />
            </div>
          </section>

          <div className="flex gap-4">
            <Link href="/admin/products"
              className="flex-1 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors text-center">
              Cancel
            </Link>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 bg-maroon-500 hover:bg-maroon-600 disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              {saving
                ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                : <Save size={16} />}
              {saving ? 'Saving…' : 'Add Product to Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

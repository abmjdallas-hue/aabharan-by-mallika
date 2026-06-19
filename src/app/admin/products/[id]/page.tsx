'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Save, CheckCircle } from 'lucide-react'
import { useProducts } from '@/context/ProductsContext'
import { Category, Collection, SilverSubcategory, SILVER_SUBCATEGORIES } from '@/types'
import InstagramImporter from '@/components/admin/InstagramImporter'

const CATEGORIES: Category[] = [
  'Necklaces', 'Haram', 'Earrings', 'Bangles', 'Rings',
  'Pendants', 'Maang Tikka', 'Vaddanam', 'Bridal Sets', 'Silver Articles', 'Dori', 'Boxes',
]

const COLLECTIONS: Collection[] = [
  'Antique Jewellery', 'Diamond Jewellery', 'Gold Jewellery',
  'Temple Jewellery', 'Bridal Collection', 'Lightweight Jewellery', 'Festive Collection',
]

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { products, updateProduct } = useProducts()
  const product = products.find((p) => p.id === id)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [form, setForm] = useState(() => ({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    category: product?.category ?? '' as Category,
    subcategory: product?.subcategory ?? '' as SilverSubcategory | '',
    collection: product?.collection ?? '' as Collection,
    price: String(product?.price ?? ''),
    originalPrice: String(product?.originalPrice ?? ''),
    image: product?.image ?? '',
    gallery: product?.gallery?.join('\n') ?? '',
    description: product?.description ?? '',
    metalType: product?.metalType ?? '',
    weight: product?.weight ?? '',
    purity: product?.purity ?? '',
    stockStatus: product?.stockStatus ?? 'in_stock' as 'in_stock' | 'out_of_stock' | 'limited',
    featured: product?.featured ?? false,
    sku: product?.sku ?? '',
  }))

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Product not found.</p>
          <Link href="/admin/products" className="mt-3 text-maroon-500 hover:underline text-sm block">← Back to Products</Link>
        </div>
      </div>
    )
  }

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSaving(true)

    const galleryArr = form.gallery
      ? form.gallery.split('\n').map((u) => u.trim()).filter(Boolean)
      : [form.image]

    try {
      await updateProduct(id, {
        name: form.name,
        slug: form.slug,
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
      })

      setSaved(true)
      setTimeout(() => router.push('/admin/products'), 1200)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (saved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
          <p className="text-lg font-semibold text-gray-800">Changes Saved!</p>
          <p className="text-sm text-gray-500 mt-1">Redirecting…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <div className="font-serif text-xl font-bold text-gold-400">Aabharan Admin</div>
          <div className="text-xs text-gray-400">Edit Product</div>
        </div>
        <Link href="/admin/products" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
          <ChevronLeft size={14} /> Back to Products
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Edit Product</h1>
        <p className="text-sm text-gray-500 mb-6">{product.name}</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Basic Information</h2>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Product Name *</label>
              <input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Description *</label>
              <textarea required value={form.description} onChange={(e) => set('description', e.target.value)}
                rows={4} className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">SKU / Item Code</label>
              <input type="text" value={form.sku} onChange={(e) => set('sku', e.target.value)} className="input-field" />
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
                  <input type="number" required min="0" step="0.01" value={form.price}
                    onChange={(e) => set('price', e.target.value)} className="input-field pl-7" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Original Price ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="number" min="0" step="0.01" value={form.originalPrice}
                    onChange={(e) => set('originalPrice', e.target.value)} className="input-field pl-7" />
                </div>
              </div>
            </div>
          </section>

          {/* Category */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Categorisation</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Category *</label>
                <select required value={form.category} onChange={(e) => { set('category', e.target.value); set('subcategory', '') }} className="input-field">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Collection *</label>
                <select required value={form.collection} onChange={(e) => set('collection', e.target.value)} className="input-field">
                  {COLLECTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
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

          {/* Details */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Jewellery Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Metal Type *</label>
                <select required value={form.metalType} onChange={(e) => set('metalType', e.target.value)} className="input-field">
                  <option>Gold</option><option>White Gold</option><option>Rose Gold</option>
                  <option>Silver</option><option>Platinum</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Purity *</label>
                <select required value={form.purity} onChange={(e) => set('purity', e.target.value)} className="input-field">
                  <option>24 KT</option><option>22 KT</option><option>18 KT</option>
                  <option>14 KT</option><option>10 KT</option><option>925 Sterling</option><option>950 Platinum</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Weight *</label>
                <input type="text" required value={form.weight} onChange={(e) => set('weight', e.target.value)} className="input-field" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Stock Status</label>
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

            <InstagramImporter
              onUseAsMain={(url) => set('image', url)}
              onAddToGallery={(url) => set('gallery', form.gallery ? form.gallery + '\n' + url : url)}
            />

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Main Image URL *</label>
              <input type="url" required value={form.image} onChange={(e) => set('image', e.target.value)}
                placeholder="Paste a URL or use the importer above"
                className="input-field" />
              {form.image && (
                <div className="mt-3 w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Gallery URLs (one per line)</label>
              <textarea value={form.gallery} onChange={(e) => set('gallery', e.target.value)}
                rows={3} className="input-field resize-none text-xs" />
            </div>
          </section>

          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {submitError}
            </p>
          )}

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
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

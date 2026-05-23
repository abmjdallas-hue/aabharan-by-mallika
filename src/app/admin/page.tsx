'use client'

import Link from 'next/link'
import { Package, Tag, ShoppingCart, TrendingUp, PlusCircle, Store, AlertCircle, Settings, ClipboardList, Database, ChevronDown, ChevronUp, ExternalLink, CheckCircle2, LayoutGrid } from 'lucide-react'
import { useProducts } from '@/context/ProductsContext'
import { useState } from 'react'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase/)?.[1] ?? 'your-project'

const SETUP_STEPS = [
  {
    title: 'Open Supabase Storage',
    detail: 'Go to your Supabase project → Storage (left sidebar)',
    link: `https://supabase.com/dashboard/project/${projectRef}/storage/buckets`,
    linkLabel: 'Open Storage →',
  },
  {
    title: 'Create the bucket',
    detail: 'Click "New bucket", name it exactly: product-images',
  },
  {
    title: 'Make it public',
    detail: 'Toggle "Public bucket" ON before clicking Save. This lets product images load on the store.',
  },
  {
    title: 'Add an upload policy',
    detail: 'After creating the bucket, click it → Policies → "New policy" → select "Full access" for the service role, or use the SQL below.',
    code: `-- Run in Supabase SQL Editor
insert into storage.policies (name, bucket_id, operation, definition)
values ('Admin upload', 'product-images', 'INSERT', 'true');`,
  },
]

export default function AdminDashboard() {
  const { products } = useProducts()
  const [setupOpen, setSetupOpen] = useState(false)
  const [checkedSteps, setCheckedSteps] = useState<number[]>([])

  const toggleStep = (i: number) =>
    setCheckedSteps((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])
  const allDone = checkedSteps.length === SETUP_STEPS.length

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'bg-gold-100 text-gold-700' },
    { label: 'Featured Items', value: products.filter((p) => p.featured).length, icon: TrendingUp, color: 'bg-green-100 text-green-700' },
    { label: 'In Stock', value: products.filter((p) => p.stockStatus === 'in_stock').length, icon: Tag, color: 'bg-blue-100 text-blue-700' },
    { label: 'Limited Stock', value: products.filter((p) => p.stockStatus === 'limited').length, icon: ShoppingCart, color: 'bg-orange-100 text-orange-700' },
    { label: 'Out of Stock', value: products.filter((p) => p.stockStatus === 'out_of_stock').length, icon: AlertCircle, color: 'bg-red-100 text-red-700' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <div className="font-serif text-xl font-bold text-gold-400">Aabharan Admin</div>
          <div className="text-xs text-gray-400">Dashboard</div>
        </div>
        <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
          <Store size={12} /> View Store
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <Link href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-maroon-500 hover:bg-maroon-600 text-white text-sm font-semibold rounded-lg transition-colors">
            <PlusCircle size={16} /> Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon size={20} />
              </div>
              <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Supabase Storage Setup */}
        <div className={`mb-8 rounded-xl border shadow-sm overflow-hidden ${allDone ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
          <button
            onClick={() => setSetupOpen((o) => !o)}
            className="w-full flex items-center gap-3 px-5 py-4 text-left"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${allDone ? 'bg-green-500' : 'bg-blue-500'}`}>
              {allDone ? <CheckCircle2 size={18} className="text-white" /> : <Database size={18} className="text-white" />}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${allDone ? 'text-green-800' : 'text-blue-800'}`}>
                {allDone ? 'Supabase Storage — all steps done!' : 'Setup required: Supabase image storage'}
              </p>
              <p className={`text-xs mt-0.5 ${allDone ? 'text-green-600' : 'text-blue-600'}`}>
                {allDone
                  ? 'Your product-images bucket is configured. Image uploads will work.'
                  : 'Complete these steps once to enable Instagram import & file uploads.'}
              </p>
            </div>
            {setupOpen ? <ChevronUp size={16} className="text-blue-400 shrink-0" /> : <ChevronDown size={16} className="text-blue-400 shrink-0" />}
          </button>

          {setupOpen && (
            <div className="px-5 pb-5 space-y-4 border-t border-blue-200">
              <p className="text-xs text-blue-700 pt-4">
                The Instagram importer and Upload tab store images in a Supabase Storage bucket called <code className="bg-blue-100 px-1 rounded font-mono">product-images</code>.
                The bucket is created automatically on first upload, but you need to make it <strong>public</strong> in advance so images display on the store.
              </p>

              <ol className="space-y-3">
                {SETUP_STEPS.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => toggleStep(i)}
                      className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                        checkedSteps.includes(i)
                          ? 'bg-green-500 border-green-500'
                          : 'border-blue-300 bg-white hover:border-blue-500'
                      }`}
                    >
                      {checkedSteps.includes(i) && <CheckCircle2 size={12} className="text-white" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${checkedSteps.includes(i) ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        Step {i + 1}: {step.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{step.detail}</p>
                      {'link' in step && (
                        <a
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                        >
                          {step.linkLabel} <ExternalLink size={10} />
                        </a>
                      )}
                      {'code' in step && (
                        <pre className="mt-2 bg-gray-900 text-green-300 text-[10px] p-3 rounded-lg overflow-x-auto leading-relaxed">
                          {step.code}
                        </pre>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              <div className="pt-2 border-t border-blue-200">
                <p className="text-xs text-blue-600">
                  Once done, the bucket is ready. No code changes needed — image uploads go live immediately.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Manage All Products', href: '/admin/products', desc: 'View, edit, or delete any jewellery listing', icon: Package },
            { label: 'Add New Product', href: '/admin/products/new', desc: 'List a new jewellery piece with price & weight', icon: PlusCircle },
            { label: 'Preview Store', href: '/', desc: 'See how customers see your live shop', icon: Store },
            { label: 'View Orders', href: '/admin/orders', desc: 'Track all orders, FedEx labels and shipping status', icon: ClipboardList },
            { label: 'Category Images', href: '/admin/categories', desc: 'Upload photos for each jewellery category', icon: LayoutGrid },
            { label: 'Store Settings', href: '/admin/settings', desc: 'Update store hours and appointment availability', icon: Settings },
          ].map((link) => (
            <Link key={link.label} href={link.href}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-gold-300 hover:shadow-md transition-all group">
              <div className="w-10 h-10 bg-gold-100 text-gold-700 rounded-lg flex items-center justify-center mb-3 group-hover:bg-gold-200 transition-colors">
                <link.icon size={20} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{link.label}</h3>
              <p className="text-xs text-gray-500">{link.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent Products</h2>
            <Link href="/admin/products" className="text-xs text-maroon-500 hover:underline">View All →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {products.slice(0, 6).map((product) => (
              <div key={product.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.category} · {product.metalType} · {product.weight}</p>
                </div>
                <div className="ml-auto flex items-center gap-4 shrink-0">
                  <span className="text-sm font-semibold text-gray-900">
                    ${product.price.toLocaleString('en-US')}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    product.stockStatus === 'in_stock' ? 'bg-green-100 text-green-700' :
                    product.stockStatus === 'limited' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {product.stockStatus === 'in_stock' ? 'In Stock' : product.stockStatus === 'limited' ? 'Limited' : 'Out of Stock'}
                  </span>
                  <Link href={`/admin/products/${product.id}`} className="text-xs text-maroon-500 hover:underline">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

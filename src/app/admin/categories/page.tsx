'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Store, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { categories } from '@/data/products'
import { compressImage } from '@/lib/compress-image'
import { adminFetch } from '@/lib/admin-fetch'

interface CategoryImage {
  name: string
  image_url: string
}

export default function AdminCategoriesPage() {
  const [images, setImages] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    adminFetch('/api/admin/categories')
      .then(r => r.json())
      .then((data: CategoryImage[]) => {
        const map: Record<string, string> = {}
        data.forEach(c => { map[c.name] = c.image_url })
        setImages(map)
      })
  }, [])

  const handleUpload = async (catName: string, file: File) => {
    setUploading(catName)
    setError(null)
    setSaved(null)

    try {
      const compressed = await compressImage(file)
      const form = new FormData()
      form.append('file', compressed)
      const uploadRes = await adminFetch('/api/admin/upload-image', { method: 'POST', body: form })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok || !uploadData.imageUrl) throw new Error(uploadData.error ?? 'Upload failed')

      const saveRes = await adminFetch('/api/admin/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catName, image_url: uploadData.imageUrl }),
      })
      if (!saveRes.ok) throw new Error('Failed to save image')

      setImages(prev => ({ ...prev, [catName]: uploadData.imageUrl }))
      setSaved(catName)
      setTimeout(() => setSaved(null), 2500)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <div className="font-serif text-xl font-bold text-gold-400">Aabharan Admin</div>
          <div className="text-xs text-gray-400">Category Images</div>
        </div>
        <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
          <Store size={12} /> View Store
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Link href="/admin" className="hover:text-maroon-500">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Category Images</span>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">Category Images</h1>
          <p className="text-sm text-gray-500 mt-1">Upload a photo for each category. It shows as a circle on the homepage.</p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            <AlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const imgUrl = images[cat.name]
            const isUploading = uploading === cat.name
            const isSaved = saved === cat.name

            return (
              <div key={cat.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-3">
                {/* Image preview */}
                <div
                  className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-100 flex items-center justify-center cursor-pointer group"
                  onClick={() => inputRefs.current[cat.name]?.click()}
                >
                  {imgUrl ? (
                    <>
                      <Image src={imgUrl} alt={cat.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                        <Upload size={20} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-maroon-400 transition-colors">
                      <Upload size={20} />
                      <span className="text-[10px]">Upload</span>
                    </div>
                  )}

                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-full">
                      <Loader2 size={20} className="animate-spin text-maroon-500" />
                    </div>
                  )}
                </div>

                <p className="text-sm font-semibold text-gray-800 text-center leading-tight">{cat.name}</p>

                {isSaved ? (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Saved
                  </span>
                ) : (
                  <button
                    onClick={() => inputRefs.current[cat.name]?.click()}
                    disabled={isUploading}
                    className="text-xs px-3 py-1.5 bg-maroon-500 hover:bg-maroon-600 disabled:bg-maroon-300 text-white rounded-lg transition-colors"
                  >
                    {imgUrl ? 'Change Photo' : 'Upload Photo'}
                  </button>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={el => { inputRefs.current[cat.name] = el }}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload(cat.name, file)
                    e.target.value = ''
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

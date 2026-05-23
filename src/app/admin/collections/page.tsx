'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Store, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { collections } from '@/data/products'
import { compressImage } from '@/lib/compress-image'

interface CollectionImage {
  name: string
  image_url: string
}

export default function AdminCollectionsPage() {
  const [images, setImages] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    fetch('/api/admin/collection-images')
      .then(r => r.json())
      .then((data: CollectionImage[]) => {
        const map: Record<string, string> = {}
        data.forEach(c => { map[c.name] = c.image_url })
        setImages(map)
      })
  }, [])

  const handleUpload = async (colName: string, file: File) => {
    setUploading(colName)
    setError(null)
    setSaved(null)

    try {
      const compressed = await compressImage(file)
      const form = new FormData()
      form.append('file', compressed)
      const uploadRes = await fetch('/api/admin/upload-image', { method: 'POST', body: form })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok || !uploadData.imageUrl) throw new Error(uploadData.error ?? 'Upload failed')

      const saveRes = await fetch('/api/admin/collection-images', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: colName, image_url: uploadData.imageUrl }),
      })
      if (!saveRes.ok) throw new Error('Failed to save image')

      setImages(prev => ({ ...prev, [colName]: uploadData.imageUrl }))
      setSaved(colName)
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
          <div className="text-xs text-gray-400">Collection Images</div>
        </div>
        <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
          <Store size={12} /> View Store
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Link href="/admin" className="hover:text-maroon-500">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Collection Images</span>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">Collection Images</h1>
          <p className="text-sm text-gray-500 mt-1">Upload a banner photo for each collection. Shows as a tall card on the homepage.</p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            <AlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {collections.map((col) => {
            const imgUrl = images[col.name]
            const isUploading = uploading === col.name
            const isSaved = saved === col.name

            return (
              <div key={col.name} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Image preview */}
                <div
                  className="relative h-40 bg-gray-100 cursor-pointer group"
                  onClick={() => inputRefs.current[col.name]?.click()}
                >
                  {imgUrl ? (
                    <>
                      <Image src={imgUrl} alt={col.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex items-center gap-2 text-white text-sm font-medium">
                          <Upload size={16} /> Change Photo
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 group-hover:text-maroon-400 transition-colors">
                      <Upload size={24} />
                      <span className="text-xs">Click to upload</span>
                    </div>
                  )}

                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader2 size={24} className="animate-spin text-maroon-500" />
                    </div>
                  )}
                </div>

                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{col.name}</p>
                    <p className="text-xs text-gray-400 truncate">{col.description}</p>
                  </div>

                  {isSaved ? (
                    <span className="text-xs text-green-600 flex items-center gap-1 shrink-0">
                      <CheckCircle2 size={12} /> Saved
                    </span>
                  ) : (
                    <button
                      onClick={() => inputRefs.current[col.name]?.click()}
                      disabled={isUploading}
                      className="text-xs px-3 py-1.5 bg-maroon-500 hover:bg-maroon-600 disabled:bg-maroon-300 text-white rounded-lg transition-colors shrink-0"
                    >
                      {imgUrl ? 'Change' : 'Upload'}
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={el => { inputRefs.current[col.name] = el }}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload(col.name, file)
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

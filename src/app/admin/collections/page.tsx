'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Store, Upload, Loader2, AlertCircle, X, ImageIcon } from 'lucide-react'
import { collections } from '@/data/products'
import { compressImage } from '@/lib/compress-image'
import { adminFetch } from '@/lib/admin-fetch'

interface CollectionImage {
  id: string
  name: string
  image_url: string
  sort_order: number
}

export default function AdminCollectionsPage() {
  // collection name -> list of uploaded photos
  const [images, setImages] = useState<Record<string, CollectionImage[]>>({})
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    adminFetch('/api/admin/collection-images')
      .then(r => r.json())
      .then((data: CollectionImage[]) => {
        const map: Record<string, CollectionImage[]> = {}
        data.forEach(c => { (map[c.name] ??= []).push(c) })
        setImages(map)
      })
      .catch(() => {})
  }, [])

  const handleUpload = async (colName: string, files: FileList) => {
    setUploading(colName)
    setError(null)
    try {
      for (const file of Array.from(files)) {
        const compressed = await compressImage(file)
        const form = new FormData()
        form.append('file', compressed)
        const uploadRes = await adminFetch('/api/admin/upload-image', { method: 'POST', body: form })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok || !uploadData.imageUrl) throw new Error(uploadData.error ?? 'Upload failed')

        const saveRes = await adminFetch('/api/admin/collection-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: colName, image_url: uploadData.imageUrl }),
        })
        const saved = await saveRes.json()
        if (!saveRes.ok) throw new Error(saved.error ?? 'Failed to save image')

        setImages(prev => ({ ...prev, [colName]: [...(prev[colName] ?? []), saved] }))
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setUploading(null)
    }
  }

  const handleDelete = async (colName: string, id: string) => {
    setError(null)
    // optimistic removal
    setImages(prev => ({ ...prev, [colName]: (prev[colName] ?? []).filter(i => i.id !== id) }))
    const res = await adminFetch('/api/admin/collection-images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) setError('Failed to delete image — refresh and try again.')
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
          <p className="text-sm text-gray-500 mt-1">
            Upload one or more photos for each collection. They rotate as a slideshow on the
            homepage hero and in the &ldquo;Our Collections&rdquo; cards.
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            <AlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-5">
          {collections.map((col) => {
            const photos = images[col.name] ?? []
            const isUploading = uploading === col.name

            return (
              <div key={col.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{col.name}</p>
                    <p className="text-xs text-gray-400 truncate">{col.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-100 group">
                      <Image src={photo.image_url} alt={col.name} fill className="object-cover" />
                      <button
                        onClick={() => handleDelete(col.name, photo.id)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                        aria-label="Remove photo"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {/* Add tile */}
                  <button
                    onClick={() => inputRefs.current[col.name]?.click()}
                    disabled={isUploading}
                    className="w-28 h-28 rounded-lg border-2 border-dashed border-gray-200 hover:border-maroon-400 text-gray-400 hover:text-maroon-500 flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50"
                  >
                    {isUploading ? (
                      <Loader2 size={22} className="animate-spin text-maroon-500" />
                    ) : photos.length === 0 ? (
                      <>
                        <ImageIcon size={22} />
                        <span className="text-xs">Add photos</span>
                      </>
                    ) : (
                      <>
                        <Upload size={22} />
                        <span className="text-xs">Add more</span>
                      </>
                    )}
                  </button>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  ref={el => { inputRefs.current[col.name] = el }}
                  onChange={e => {
                    const files = e.target.files
                    if (files && files.length) handleUpload(col.name, files)
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

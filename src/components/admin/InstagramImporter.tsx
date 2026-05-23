'use client'

import { useState, useRef, useCallback } from 'react'
import { Instagram, Upload, Link as LinkIcon, Loader2, CheckCircle, AlertCircle, X, Plus } from 'lucide-react'

type Tab = 'instagram' | 'upload' | 'url'

interface Props {
  onUseAsMain: (url: string) => void
  onAddToGallery: (url: string) => void
}

export default function InstagramImporter({ onUseAsMain, onAddToGallery }: Props) {
  const [tab, setTab] = useState<Tab>('instagram')
  const [igUrl, setIgUrl] = useState('')
  const [directUrl, setDirectUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const reset = () => { setResult(null); setError(null) }

  const handleInstagramImport = async () => {
    if (!igUrl.trim()) return
    reset()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/instagram-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: igUrl.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Import failed')
      setResult(data.imageUrl)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    reset()
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      setResult(data.imageUrl)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDirectUrl = () => {
    if (!directUrl.trim()) return
    setResult(directUrl.trim())
    setError(null)
  }

  const useAsMain = () => { if (result) { onUseAsMain(result); setResult(null); setIgUrl(''); setDirectUrl('') } }
  const addToGallery = () => { if (result) { onAddToGallery(result); setResult(null); setIgUrl(''); setDirectUrl('') } }

  return (
    <div className="border border-dashed border-gold-300 rounded-xl p-4 bg-gold-50/30">
      <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Import Image</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white rounded-lg p-1 border border-gray-100">
        <button
          type="button"
          onClick={() => { setTab('instagram'); reset() }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition-colors ${
            tab === 'instagram' ? 'bg-maroon-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Instagram size={13} /> Instagram
        </button>
        <button
          type="button"
          onClick={() => { setTab('upload'); reset() }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition-colors ${
            tab === 'upload' ? 'bg-maroon-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload size={13} /> Upload
        </button>
        <button
          type="button"
          onClick={() => { setTab('url'); reset() }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition-colors ${
            tab === 'url' ? 'bg-maroon-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LinkIcon size={13} /> Direct URL
        </button>
      </div>

      {/* Instagram tab */}
      {tab === 'instagram' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Paste any Instagram post link — we'll pull the image automatically.</p>
          <div className="flex gap-2">
            <input
              type="url"
              value={igUrl}
              onChange={(e) => setIgUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleInstagramImport())}
              placeholder="https://www.instagram.com/p/..."
              className="input-field flex-1 text-xs"
            />
            <button
              type="button"
              onClick={handleInstagramImport}
              disabled={loading || !igUrl.trim()}
              className="px-3 py-2 bg-maroon-500 hover:bg-maroon-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Instagram size={13} />}
              Import
            </button>
          </div>
        </div>
      )}

      {/* Upload tab */}
      {tab === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-maroon-400 bg-maroon-50' : 'border-gray-200 hover:border-gold-400 hover:bg-gold-50'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }}
          />
          {loading ? (
            <Loader2 size={24} className="animate-spin text-maroon-400 mx-auto mb-2" />
          ) : (
            <Upload size={24} className="text-gray-300 mx-auto mb-2" />
          )}
          <p className="text-xs text-gray-500">
            {loading ? 'Uploading…' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WebP · max 10 MB</p>
        </div>
      )}

      {/* Direct URL tab */}
      {tab === 'url' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Paste any direct image URL (right-click an image → Copy image address).</p>
          <div className="flex gap-2">
            <input
              type="url"
              value={directUrl}
              onChange={(e) => setDirectUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleDirectUrl())}
              placeholder="https://…/image.jpg"
              className="input-field flex-1 text-xs"
            />
            <button
              type="button"
              onClick={handleDirectUrl}
              disabled={!directUrl.trim()}
              className="px-3 py-2 bg-maroon-500 hover:bg-maroon-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Preview
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-red-600">{error}</p>
            {tab === 'instagram' && (
              <p className="text-[10px] text-red-400 mt-1">
                Tip: Try the Upload tab — save the photo from Instagram and upload it here.
              </p>
            )}
          </div>
          <button type="button" onClick={() => setError(null)}><X size={12} className="text-red-400" /></button>
        </div>
      )}

      {/* Result preview */}
      {result && (
        <div className="mt-3 p-3 bg-white border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-green-500" />
            <span className="text-xs font-medium text-green-700">Image ready</span>
            <button type="button" onClick={() => setResult(null)} className="ml-auto"><X size={12} className="text-gray-400" /></button>
          </div>
          <div className="flex gap-3 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result} alt="Preview" className="w-20 h-20 object-cover rounded-md border border-gray-200 shrink-0" />
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={useAsMain}
                className="px-3 py-1.5 bg-maroon-500 hover:bg-maroon-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Use as Main Image
              </button>
              <button
                type="button"
                onClick={addToGallery}
                className="px-3 py-1.5 border border-gold-300 hover:bg-gold-50 text-gold-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus size={11} /> Add to Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

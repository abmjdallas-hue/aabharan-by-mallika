'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Store, Clock, Save, CheckCircle, ArrowLeft } from 'lucide-react'
import { useStoreHours } from '@/hooks/useStoreHours'
import { StoreHours } from '@/lib/config'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function pad(n: number) { return String(n).padStart(2, '0') }
function toTimeStr(h: number, m: number) { return `${pad(h)}:${pad(m)}` }
function fromTimeStr(s: string): { hour: number; minute: number } {
  const [h, m] = s.split(':').map(Number)
  return { hour: h, minute: m }
}

export default function AdminSettingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { hours, loading, saving, saveHours } = useStoreHours()

  const [openTime, setOpenTime] = useState('12:00')
  const [closeTime, setCloseTime] = useState('19:30')
  const [closedDays, setClosedDays] = useState<number[]>([1])
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) router.replace('/admin')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!loading) {
      setOpenTime(toTimeStr(hours.openHour, hours.openMinute))
      setCloseTime(toTimeStr(hours.closeHour, hours.closeMinute))
      setClosedDays(hours.closedDays)
    }
  }, [loading, hours])

  const toggleDay = (day: number) => {
    setClosedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSave = async () => {
    setError('')
    setSaved(false)
    const open = fromTimeStr(openTime)
    const close = fromTimeStr(closeTime)
    if (open.hour * 60 + open.minute >= close.hour * 60 + close.minute) {
      setError('Opening time must be before closing time.')
      return
    }
    const updated: StoreHours = {
      openHour: open.hour, openMinute: open.minute,
      closeHour: close.hour, closeMinute: close.minute,
      closedDays,
    }
    const result = await saveHours(updated)
    if (result.error) { setError(result.error); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (authLoading || loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-400">Loading…</div></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <div className="font-serif text-xl font-bold text-gold-400">Aabharan Admin</div>
          <div className="text-xs text-gray-400">Store Settings</div>
        </div>
        <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
          <Store size={12} /> View Store
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/admin" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-maroon-500 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-8">Store Settings</h1>

        {/* Store Hours */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-gold-100 text-gold-700 rounded-lg flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Store Hours</h2>
              <p className="text-xs text-gray-400">Controls when the &quot;Book Appointment&quot; button appears on the site</p>
            </div>
          </div>

          {/* Open / Close times */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Opening Time</label>
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Closing Time</label>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Closed days */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-600 mb-2">Closed Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day, i) => (
                <button
                  key={day}
                  onClick={() => toggleDay(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    closedDays.includes(i)
                      ? 'bg-red-50 border-red-300 text-red-600'
                      : 'bg-green-50 border-green-300 text-green-700'
                  }`}
                >
                  {day} {closedDays.includes(i) ? '✕' : '✓'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Red = closed, Green = open</p>
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-maroon-500 hover:bg-maroon-600 text-white disabled:opacity-50'
            }`}
          >
            {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}</>}
          </button>
        </div>
      </div>
    </div>
  )
}

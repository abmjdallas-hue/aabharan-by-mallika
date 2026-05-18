'use client'

import { useState, useEffect, useCallback } from 'react'
import { StoreHours, DEFAULT_STORE_HOURS } from '@/lib/config'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const LS_KEY = 'aabharan-store-hours'

export function useStoreHours() {
  const [hours, setHours] = useState<StoreHours>(DEFAULT_STORE_HOURS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      try {
        const saved = localStorage.getItem(LS_KEY)
        if (saved) setHours(JSON.parse(saved))
      } catch {}
      setLoading(false)
      return
    }
    supabase
      .from('settings')
      .select('value')
      .eq('key', 'store_hours')
      .single()
      .then(({ data }) => {
        if (data?.value) setHours(data.value as StoreHours)
        setLoading(false)
      })
  }, [])

  const saveHours = useCallback(async (updated: StoreHours): Promise<{ error?: string }> => {
    setSaving(true)
    try {
      if (!isSupabaseConfigured) {
        localStorage.setItem(LS_KEY, JSON.stringify(updated))
        setHours(updated)
        return {}
      }
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'store_hours', value: updated })
      if (error) return { error: error.message }
      setHours(updated)
      return {}
    } finally {
      setSaving(false)
    }
  }, [])

  return { hours, loading, saving, saveHours }
}

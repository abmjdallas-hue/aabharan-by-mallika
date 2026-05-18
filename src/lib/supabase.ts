import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// Falls back to a placeholder so the app doesn't crash when credentials aren't set yet
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder-key'
)

// Server-side admin client — bypasses RLS, only used in API routes / webhooks
export const supabaseAdmin = createClient(
  url || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || key || 'placeholder-key'
)

// True only when real Supabase credentials are present
export const isSupabaseConfigured =
  url.startsWith('https://') && key.length > 20

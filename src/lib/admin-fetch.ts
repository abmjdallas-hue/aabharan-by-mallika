import { supabase } from '@/lib/supabase'

/**
 * Client-side fetch wrapper for admin API routes. Attaches the logged-in admin's
 * Supabase access token as a Bearer header so the server route's `requireAdmin`
 * guard can verify the caller. Does not set Content-Type, so it works for both
 * JSON bodies (caller sets the header) and FormData uploads (browser sets it).
 */
export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return fetch(input, { ...init, headers })
}

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

type AdminResult =
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse }

/**
 * Verifies that the request comes from a logged-in admin.
 * Expects the caller's Supabase access token in `Authorization: Bearer <token>`.
 * The token is validated server-side and the user's `profiles.is_admin` flag is
 * checked — the client can't fake this. On success the route may safely use the
 * service-role client to write.
 */
export async function requireAdmin(req: Request): Promise<AdminResult> {
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) {
    return { ok: false, response: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }) }
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) {
    return { ok: false, response: NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 }) }
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return { ok: false, response: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) }
  }

  return { ok: true, userId: user.id }
}

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

// All collection photos, ordered. Each collection can have several.
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const { data, error } = await supabaseAdmin
    .from('collection_gallery')
    .select('*')
    .order('name', { ascending: true })
    .order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// Add a photo to a collection (appended after any existing photos).
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const { name, image_url } = await req.json()
  if (!name || !image_url)
    return NextResponse.json({ error: 'name and image_url are required' }, { status: 400 })

  const { data: last } = await supabaseAdmin
    .from('collection_gallery')
    .select('sort_order')
    .eq('name', name)
    .order('sort_order', { ascending: false })
    .limit(1)
  const sort_order = (last?.[0]?.sort_order ?? -1) + 1

  const { data, error } = await supabaseAdmin
    .from('collection_gallery')
    .insert({ name, image_url, sort_order })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/')
  return NextResponse.json(data)
}

// Remove a single photo by id.
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const { error } = await supabaseAdmin.from('collection_gallery').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/')
  return NextResponse.json({ ok: true })
}

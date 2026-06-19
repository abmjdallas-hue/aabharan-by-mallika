import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'
import { productUpdatesToRow } from '@/lib/products-mapper'

// Update a product — admin only.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const { id } = await params
  const updates = await req.json()

  const { error } = await supabaseAdmin
    .from('products')
    .update(productUpdatesToRow(updates))
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  revalidatePath('/')
  revalidatePath('/shop')
  return NextResponse.json({ ok: true })
}

// Delete a product — admin only.
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const { id } = await params

  const { error } = await supabaseAdmin.from('products').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  revalidatePath('/')
  revalidatePath('/shop')
  return NextResponse.json({ ok: true })
}

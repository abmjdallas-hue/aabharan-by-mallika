import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'
import { productToRow, rowToProduct } from '@/lib/products-mapper'

// Create a product — admin only.
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const body = await req.json()

  const { data: row, error } = await supabaseAdmin
    .from('products')
    .insert(productToRow(body))
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  revalidatePath('/')
  revalidatePath('/shop')
  return NextResponse.json(rowToProduct(row), { status: 201 })
}

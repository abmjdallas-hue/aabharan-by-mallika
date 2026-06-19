import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

const BUCKET = 'product-images'

async function ensureBucket() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets()
  if (!buckets?.find((b) => b.name === BUCKET)) {
    await supabaseAdmin.storage.createBucket(BUCKET, { public: true })
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and GIF images are allowed' }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'Image must be under 10 MB' }, { status: 400 })
  }

  try {
    await ensureBucket()
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const filename = `upload-${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filename, buffer, { contentType: file.type, upsert: false })
    if (error) throw error
    const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(data.path)
    return NextResponse.json({ imageUrl: publicUrl })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

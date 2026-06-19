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

  const { url } = await req.json() as { url: string }
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  // ── Step 1: fetch the Instagram post page ────────────────────
  let ogImageUrl: string
  try {
    const pageRes = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
      redirect: 'follow',
    })
    const html = await pageRes.text()
    const match =
      html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/) ||
      html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/)
    if (!match) {
      return NextResponse.json(
        { error: 'Instagram blocked the request or no image found. Try the Upload tab instead.' },
        { status: 422 }
      )
    }
    ogImageUrl = match[1].replace(/&amp;/g, '&')
  } catch {
    return NextResponse.json(
      { error: 'Could not reach Instagram. Check the URL and try again.' },
      { status: 502 }
    )
  }

  // ── Step 2: download the image ───────────────────────────────
  let imgBuffer: Buffer
  let contentType: string
  try {
    const imgRes = await fetch(ogImageUrl, {
      headers: {
        Referer: 'https://www.instagram.com/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    })
    if (!imgRes.ok) throw new Error('Image download failed')
    imgBuffer = Buffer.from(await imgRes.arrayBuffer())
    contentType = imgRes.headers.get('content-type') ?? 'image/jpeg'
  } catch {
    return NextResponse.json({ error: 'Could not download the image.' }, { status: 502 })
  }

  // ── Step 3: upload to Supabase Storage ───────────────────────
  try {
    await ensureBucket()
    const ext = contentType.includes('png') ? 'png' : 'jpg'
    const filename = `ig-${Date.now()}.${ext}`
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filename, imgBuffer, { contentType, upsert: false })
    if (error) throw error
    const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(data.path)
    return NextResponse.json({ imageUrl: publicUrl })
  } catch (err) {
    return NextResponse.json(
      { error: `Storage error: ${(err as Error).message}` },
      { status: 500 }
    )
  }
}

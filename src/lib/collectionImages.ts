import { supabaseAdmin } from '@/lib/supabase'

export interface CollectionImageRow {
  id: string
  name: string
  image_url: string
  sort_order: number
}

// Fetches every uploaded collection photo, grouped by collection name and
// ordered by sort_order. Used by the homepage hero + collections slideshows.
export async function getCollectionGallery(): Promise<Record<string, string[]>> {
  const { data } = await supabaseAdmin
    .from('collection_gallery')
    .select('name, image_url, sort_order')
    .order('sort_order', { ascending: true })

  const map: Record<string, string[]> = {}
  ;(data ?? []).forEach((r: { name: string; image_url: string }) => {
    if (!r.image_url) return
    ;(map[r.name] ??= []).push(r.image_url)
  })
  return map
}

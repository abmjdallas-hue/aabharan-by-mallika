// ─────────────────────────────────────────────────────────────
//  MANUAL SOCIAL FEED — edit this file to update "From Our Socials"
//
//  Real Instagram / Facebook feeds require Meta Graph API + app
//  review, so for now this is curated manually. To add a post:
//   1. Take a screenshot / save the thumbnail into /public/socials/
//      (or paste any direct image URL).
//   2. Add an entry below. Newest first looks best.
// ─────────────────────────────────────────────────────────────

export type SocialPlatform = 'instagram' | 'youtube' | 'facebook'
export type SocialType = 'reel' | 'post' | 'video' | 'update'

export interface SocialPost {
  id: string
  platform: SocialPlatform
  type: SocialType
  title: string
  caption: string
  date: string        // ISO date, e.g. '2026-05-28'
  thumbnail: string   // image path/URL — leave '' for branded placeholder
  url: string         // link to the actual post/reel/video
}

export const socialPosts: SocialPost[] = [
  {
    id: 'ig-bridal-1',
    platform: 'instagram',
    type: 'reel',
    title: 'Bridal Polki Set',
    caption: 'A regal uncut-diamond polki set for the modern bride ✨ Swipe to see it shine.',
    date: '2026-05-30',
    thumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=750&fit=crop&q=80',
    url: 'https://instagram.com/aabharanbymallika',
  },
  {
    id: 'yt-temple-1',
    platform: 'youtube',
    type: 'video',
    title: 'Temple Jewellery Styling',
    caption: 'How to style antique temple jewellery for a classical Kuchipudi look.',
    date: '2026-05-22',
    thumbnail: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=750&fit=crop&q=80',
    url: 'https://www.youtube.com/@MallikaJujjavarapu',
  },
  {
    id: 'ig-diamond-1',
    platform: 'instagram',
    type: 'post',
    title: 'IGI Diamond Drops',
    caption: 'New arrival — IGI certified diamond drops set in 18KT rose gold. 💎',
    date: '2026-05-15',
    thumbnail: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=750&fit=crop&q=80',
    url: 'https://instagram.com/aabharanbymallika',
  },
  {
    id: 'fb-festive-1',
    platform: 'facebook',
    type: 'update',
    title: 'Festive Collection Launch',
    caption: 'Our festive collection is now live in-store & online. Visit us in Frisco!',
    date: '2026-05-08',
    thumbnail: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=750&fit=crop&q=80',
    url: 'https://www.facebook.com/AabharanJewelry',
  },
  {
    id: 'ig-lightweight-1',
    platform: 'instagram',
    type: 'reel',
    title: 'Everyday Lightweight Gold',
    caption: 'Lightweight 22KT pieces you can wear from desk to dinner. 🌼',
    date: '2026-04-29',
    thumbnail: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=750&fit=crop&q=80',
    url: 'https://instagram.com/aabharanbymallika',
  },
  {
    id: 'yt-behind-1',
    platform: 'youtube',
    type: 'video',
    title: 'Behind the Craft',
    caption: 'A glimpse into the artistry behind every Aabharan creation.',
    date: '2026-04-18',
    thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=750&fit=crop&q=80',
    url: 'https://www.youtube.com/@MallikaJujjavarapu',
  },
]

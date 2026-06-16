// ─────────────────────────────────────────────────────────────
//  "FROM OUR SOCIALS" — your real posts go here.
//
//  This is intentionally EMPTY. Real Instagram / Facebook feeds
//  can't be pulled automatically without Meta Graph API + app
//  review, so each post is added by hand using YOUR real content.
//
//  To add one of your real posts:
//   1. Open your real post/reel/video on Instagram, YouTube or FB.
//   2. Save a screenshot/thumbnail into /public/socials/ (e.g.
//      /public/socials/my-reel.jpg) — or paste a direct image URL.
//   3. Copy the post's share link for `url`.
//   4. Add an entry below (newest first). Example:
//
//   {
//     id: 'ig-2026-06-01',
//     platform: 'instagram',
//     type: 'reel',
//     title: 'Bridal Polki Set',
//     caption: 'Your real caption here…',
//     date: '2026-06-01',
//     thumbnail: '/socials/my-reel.jpg',
//     url: 'https://www.instagram.com/reel/XXXXXXXXX/',
//   },
//
//  The section automatically hides itself while this list is empty.
// ─────────────────────────────────────────────────────────────

export type SocialPlatform = 'instagram' | 'youtube' | 'facebook'
export type SocialType = 'reel' | 'post' | 'video' | 'update'

export interface SocialPost {
  id: string
  platform: SocialPlatform
  type: SocialType
  title: string
  caption: string
  date: string        // ISO date, e.g. '2026-06-01'
  thumbnail: string   // image path/URL — '' shows a branded placeholder
  url: string         // link to YOUR actual post/reel/video
}

export const socialPosts: SocialPost[] = []

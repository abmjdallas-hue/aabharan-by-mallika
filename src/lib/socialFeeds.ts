// ─────────────────────────────────────────────────────────────
//  SOCIAL FEED FETCHERS (server-side)
//
//  • YouTube  — public RSS feed, no API key, cached 1h.
//  • Instagram — via a Behold.so feed (free connector). You connect
//    your real IG account at behold.so and paste the Feed ID into
//    BUSINESS.beholdFeedId. We render the posts in our own styling.
//  • Facebook — no free per-post API; added manually in
//    src/data/socialPosts.ts and merged in by the SocialFeed component.
// ─────────────────────────────────────────────────────────────
import type { SocialPost } from '@/data/socialPosts'

const REVALIDATE = 3600 // re-fetch at most once an hour

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .trim()
}

/** Fetch the latest public videos for a YouTube channel via its RSS feed. */
export async function getYouTubeVideos(channelId: string, limit = 8): Promise<SocialPost[]> {
  if (!channelId) return []
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: REVALIDATE } }
    )
    if (!res.ok) return []
    const xml = await res.text()

    return xml
      .split('<entry>')
      .slice(1)
      .map((entry): SocialPost | null => {
        const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
        if (!id) return null
        const title = decodeEntities(entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? 'YouTube Video')
        const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? ''
        const desc = decodeEntities(
          entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ?? ''
        )
        return {
          id: `yt-${id}`,
          platform: 'youtube',
          type: 'video',
          title,
          caption: desc.slice(0, 140),
          date: published.slice(0, 10),
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${id}`,
        }
      })
      .filter((p): p is SocialPost => p !== null)
      .slice(0, limit)
  } catch {
    return []
  }
}

/** Minimal shape of a Behold feed item (defensive — fields vary by plan). */
interface BeholdSize { mediaUrl?: string }
interface BeholdItem {
  id?: string
  permalink?: string
  caption?: string
  prunedCaption?: string
  timestamp?: string
  mediaType?: string
  mediaUrl?: string
  thumbnailUrl?: string
  // Behold-hosted, STABLE CDN copies (Instagram's own URLs expire)
  sizes?: { large?: BeholdSize; medium?: BeholdSize; small?: BeholdSize }
}

/** Fetch real Instagram posts from a Behold.so feed (free connector). */
export async function getInstagramPosts(feedId: string, limit = 8): Promise<SocialPost[]> {
  if (!feedId) return []
  try {
    const res = await fetch(`https://feeds.behold.so/${feedId}`, {
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) return []
    const data = await res.json()
    const items: BeholdItem[] = Array.isArray(data) ? data : (data.posts ?? data.media ?? [])

    return items.slice(0, limit).map((m, i): SocialPost => {
      const isVideo = (m.mediaType ?? '').toUpperCase() === 'VIDEO'
      return {
        id: `ig-${m.id ?? i}`,
        platform: 'instagram',
        type: isVideo ? 'reel' : 'post',
        title: 'Instagram',
        caption: (m.prunedCaption ?? m.caption ?? '').slice(0, 140),
        date: (m.timestamp ?? '').slice(0, 10),
        // Prefer Behold's stable CDN sizes; IG's own URLs expire.
        thumbnail:
          m.sizes?.large?.mediaUrl ||
          m.sizes?.medium?.mediaUrl ||
          m.sizes?.small?.mediaUrl ||
          m.thumbnailUrl ||
          m.mediaUrl ||
          '',
        url: m.permalink ?? 'https://instagram.com/aabharanbymallika',
      }
    })
  } catch {
    return []
  }
}

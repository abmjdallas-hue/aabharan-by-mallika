import { BUSINESS } from '@/lib/config'
import { socialPosts, type SocialPost } from '@/data/socialPosts'
import { getYouTubeVideos, getInstagramPosts, getFacebookPosts } from '@/lib/socialFeeds'
import SocialFeedClient from './SocialFeedClient'

/**
 * Server component: pulls your real posts from each platform and
 * merges them into ONE combined "From Our Socials" row.
 *
 *  • Instagram — auto via your Behold feed (BUSINESS.beholdFeedId)
 *  • YouTube   — auto via channel RSS (BUSINESS.youtubeChannelId)
 *  • Facebook  — manual entries in src/data/socialPosts.ts
 *               (Meta has no free per-post API)
 *
 * Newest first. The whole section hides itself when there's nothing.
 */
export default async function SocialFeed() {
  const [instagram, youtube, facebook] = await Promise.all([
    getInstagramPosts(BUSINESS.beholdFeedId),
    getYouTubeVideos(BUSINESS.youtubeChannelId),
    getFacebookPosts(BUSINESS.facebookPostUrls),
  ])

  // Merge all platforms + any extra manual posts into one row
  const merged: SocialPost[] = [...instagram, ...youtube, ...facebook, ...socialPosts]

  // De-dupe by id, then sort newest first
  const seen = new Set<string>()
  const posts = merged
    .filter((p) => p.id && !seen.has(p.id) && (seen.add(p.id), true))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  if (posts.length === 0) return null

  return <SocialFeedClient posts={posts} />
}

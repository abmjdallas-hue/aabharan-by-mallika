'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Instagram, Youtube, Facebook, ArrowUpRight, Play } from 'lucide-react'
import type { SocialPost, SocialPlatform } from '@/data/socialPosts'
import { fadeInUp, staggerContainer, revealViewport } from '@/lib/animations'

const PLATFORM_META: Record<
  SocialPlatform,
  { label: string; Icon: typeof Instagram; badge: string; gradient: string }
> = {
  instagram: {
    label: 'Instagram',
    Icon: Instagram,
    badge: 'bg-gradient-to-r from-pink-500 to-purple-500',
    gradient: 'linear-gradient(135deg, #831843 0%, #6b21a8 100%)',
  },
  youtube: {
    label: 'YouTube',
    Icon: Youtube,
    badge: 'bg-red-600',
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)',
  },
  facebook: {
    label: 'Facebook',
    Icon: Facebook,
    badge: 'bg-blue-600',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
  },
}

function formatDate(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function SocialFeedClient({ posts }: { posts: SocialPost[] }) {
  const reduce = useReducedMotion()
  if (posts.length === 0) return null

  return (
    <section className="py-14 sm:py-20 bg-beige/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-gold-600 text-sm tracking-widest uppercase mb-2">Stay Connected</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-500">From Our Socials</h2>
          <div className="flex items-center justify-center gap-3 my-4">
            <span className="h-px w-12 bg-gold-400/50" />
            <span className="text-gold-500 text-sm">◆</span>
            <span className="h-px w-12 bg-gold-400/50" />
          </div>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Discover our latest collections, bridal looks, and styling moments.
          </p>
        </div>

        {/* Combined horizontal scroll feed (Instagram · YouTube · Facebook) */}
        <motion.div
          variants={reduce ? undefined : staggerContainer}
          initial={reduce ? undefined : 'hidden'}
          whileInView={reduce ? undefined : 'visible'}
          viewport={revealViewport}
          className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory
                     [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5
                     [&::-webkit-scrollbar-thumb]:bg-gold-300 [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {posts.map((post) => {
            const meta = PLATFORM_META[post.platform]
            const { Icon } = meta
            const isVideo = post.type === 'reel' || post.type === 'video'
            const showTitle = post.title && post.title.toLowerCase() !== meta.label.toLowerCase()
            return (
              <motion.article
                key={post.id}
                variants={reduce ? undefined : fadeInUp}
                className="group snap-start shrink-0 w-[270px] sm:w-[300px] bg-cream rounded-2xl overflow-hidden
                           border border-gold-200/70 shadow-sm transition-all duration-500 ease-out
                           hover:-translate-y-1.5 hover:shadow-[0_18px_40px_-12px_rgba(160,120,48,0.35)] hover:border-gold-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/5] overflow-hidden" style={{ background: meta.gradient }}>
                  {post.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                  ) : (
                    <>
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(246,201,14,0.5) 1px, transparent 0)',
                          backgroundSize: '26px 26px',
                        }}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gold-200/80">
                        <Icon size={40} strokeWidth={1.5} />
                        <span className="font-serif text-lg tracking-wide">{meta.label}</span>
                      </div>
                    </>
                  )}

                  {/* Platform badge */}
                  <span className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[11px] font-semibold ${meta.badge}`}>
                    <Icon size={12} /> {meta.label}
                  </span>

                  {/* Video play indicator */}
                  {isVideo && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-80 group-hover:scale-110 transition-transform duration-500">
                        <Play size={18} fill="currentColor" />
                      </span>
                    </span>
                  )}

                  {/* Type chip */}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider">
                    {post.type}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4">
                  {post.date && (
                    <p className="text-[11px] text-gold-600 tracking-wide uppercase mb-1">{formatDate(post.date)}</p>
                  )}
                  {showTitle && (
                    <h3 className="font-serif text-base font-semibold text-maroon-600 leading-snug mb-1.5">{post.title}</h3>
                  )}
                  {post.caption && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{post.caption}</p>
                  )}
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${meta.label} ${post.type}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-500
                               border-b border-gold-400 pb-0.5 transition-colors hover:text-gold-600 hover:border-gold-600
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-sm"
                  >
                    View Post <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

import HeroBanner, { HeroSlide } from '@/components/home/HeroBanner'
import TrustBadges from '@/components/home/TrustBadges'
import ShopByCategory from '@/components/home/ShopByCategory'
import CollectionsSection from '@/components/home/CollectionsSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BridalSection from '@/components/home/BridalSection'
import SocialFeed from '@/components/home/SocialFeed'
import Newsletter from '@/components/home/Newsletter'
import Reveal from '@/components/ui/Reveal'
import { collections } from '@/data/products'
import { getCollectionGallery } from '@/lib/collectionImages'

export default async function HomePage() {
  const gallery = await getCollectionGallery()

  // One hero slide per uploaded collection photo, labelled with its collection.
  const collectionSlides: HeroSlide[] = collections.flatMap((col) =>
    (gallery[col.name] ?? []).map((image, i) => ({
      id: `${col.name}-${i}`,
      title: col.name,
      subtitle: 'Our Collections',
      description: col.description,
      cta: `Shop ${col.name}`,
      href: `/shop?collection=${encodeURIComponent(col.name)}`,
      image,
    }))
  )

  return (
    <>
      {/* Hero has its own choreographed entrance */}
      <HeroBanner collectionSlides={collectionSlides} />

      <TrustBadges />

      <Reveal>
        <ShopByCategory />
      </Reveal>

      <Reveal>
        <CollectionsSection />
      </Reveal>

      <Reveal>
        <FeaturedProducts />
      </Reveal>

      <Reveal>
        <BridalSection />
      </Reveal>

      {/* From Our Socials — manual feed */}
      <Reveal>
        <SocialFeed />
      </Reveal>

      <Reveal>
        <Newsletter />
      </Reveal>
    </>
  )
}

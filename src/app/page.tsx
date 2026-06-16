import HeroBanner from '@/components/home/HeroBanner'
import TrustBadges from '@/components/home/TrustBadges'
import ShopByCategory from '@/components/home/ShopByCategory'
import CollectionsSection from '@/components/home/CollectionsSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BridalSection from '@/components/home/BridalSection'
import SocialFeed from '@/components/home/SocialFeed'
import Newsletter from '@/components/home/Newsletter'
import Reveal from '@/components/ui/Reveal'

export default function HomePage() {
  return (
    <>
      {/* Hero has its own choreographed entrance */}
      <HeroBanner />

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

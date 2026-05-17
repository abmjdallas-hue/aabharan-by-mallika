import HeroBanner from '@/components/home/HeroBanner'
import TrustBadges from '@/components/home/TrustBadges'
import ShopByCategory from '@/components/home/ShopByCategory'
import CollectionsSection from '@/components/home/CollectionsSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BridalSection from '@/components/home/BridalSection'
import Newsletter from '@/components/home/Newsletter'

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <TrustBadges />
      <ShopByCategory />
      <CollectionsSection />
      <FeaturedProducts />
      <BridalSection />
      <Newsletter />
    </>
  )
}

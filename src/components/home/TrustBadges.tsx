import { ShieldCheck, Award, Palette, Video } from 'lucide-react'

const badges = [
  {
    icon: ShieldCheck,
    title: 'BIS Hallmarked',
    description: 'Every piece certified for purity by Bureau of Indian Standards',
  },
  {
    icon: Award,
    title: 'Certified Jewellery',
    description: 'Diamond & gemstone jewellery with internationally recognised certificates',
  },
  {
    icon: Palette,
    title: 'Custom Designs',
    description: 'Personalised jewellery crafted exclusively to your vision',
  },
  {
    icon: Video,
    title: 'Video Shopping',
    description: 'Browse and buy from the comfort of your home via live video',
  },
]

export default function TrustBadges() {
  return (
    <section className="bg-beige py-10 sm:py-14 border-y border-gold-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <div key={badge.title} className="flex flex-col items-center text-center gap-3 p-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gold-100 text-gold-600">
                <badge.icon size={24} />
              </div>
              <h3 className="font-serif text-sm sm:text-base font-semibold text-maroon-500">
                {badge.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { use, useState, useEffect, useRef } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, ChevronRight, MessageCircle } from 'lucide-react'
import { useProducts } from '@/context/ProductsContext'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import ProductCard from '@/components/shop/ProductCard'
import { isBuyable, getWhatsAppUrl } from '@/lib/whatsapp'
import { BUYABLE_CATEGORIES, Product } from '@/types'

function ProductFAQ({ isBuyable, isNoExchange }: { isBuyable: boolean; isNoExchange: boolean }) {
  const [open, setOpen] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Is this jewellery BIS Hallmarked?',
      a: 'Yes. Every gold and silver piece at Aabharan by Mallika is BIS Hallmarked and certified for metal purity as per Bureau of Indian Standards guidelines.',
    },
    {
      q: 'How is the jewellery shipped?',
      a: 'We ship via FedEx with full insurance cover. Live rates are shown at checkout based on your ZIP code. We also offer free in-store pickup at our Frisco, TX location (Tue – Sun, 12–7:30 pm).',
    },
    ...(isBuyable ? [{
      q: 'Can I pay by credit card or Affirm?',
      a: 'Yes — we accept all major credit/debit cards and Affirm buy-now-pay-later (for orders $50 and above). You can also pay by Zelle or pick up and pay in person.',
    }] : []),
    {
      q: isNoExchange ? 'What is the return policy for this item?' : 'What is the exchange policy?',
      a: isNoExchange
        ? 'All sales of Silver Articles, Dori and Boxes are final — no returns or exchanges. If you received a defective or incorrect item, contact us within 24 hours of delivery.'
        : 'We do not accept returns. Exchange is allowed within 3 days of purchase in original condition with the invoice. Any price difference based on the gold rate at the time of exchange must be settled.',
    },
    {
      q: 'Can I see the jewellery via video call before buying?',
      a: 'Absolutely. We offer live video shopping so you can view the piece in detail before placing your order. Reach us on WhatsApp to schedule a session.',
    },
  ]

  return (
    <div className="mt-12 lg:mt-16">
      <h2 className="font-serif text-2xl font-bold text-maroon-500 mb-6">Frequently Asked Questions</h2>
      <div className="border-t border-gold-100 divide-y divide-gold-100 max-w-2xl">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between py-4 text-left text-sm font-semibold text-gray-800 hover:text-maroon-500 transition-colors"
            >
              {faq.q}
              <span className={`ml-4 shrink-0 text-gold-500 text-lg leading-none transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}>+</span>
            </button>
            {open === i && (
              <p className="pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Thin wrapper: only calls useProducts before conditional returns ────────────
export default function ProductPageClient({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { getProduct, loading } = useProducts()
  const product = getProduct(slug)

  if (!product && loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-gold-300 border-t-maroon-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Loading product…</p>
        </div>
      </div>
    )
  }
  if (!product) notFound()

  return <ProductDisplay product={product!} />
}

// ── Inner component: all hooks called unconditionally ─────────────────────────
function ProductDisplay({ product }: { product: Product }) {
  const { products } = useProducts()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)
  const buyable = isBuyable(product)

  const allImages = [product.image, ...product.gallery.filter((g) => g !== product.image)].filter(Boolean)
  const hasImages = allImages.length > 0

  const [activeImage, setActiveImage] = useState(allImages[0] || '')
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description')
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [isZooming, setIsZooming] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }
  const [stickyVisible, setStickyVisible] = useState(false)
  const actionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    )
    if (actionsRef.current) observer.observe(actionsRef.current)
    return () => observer.disconnect()
  }, [])

  const isNoExchange = BUYABLE_CATEGORIES.includes(product.category)

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Breadcrumb */}
      <div className="bg-beige border-b border-gold-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-maroon-500">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-maroon-500">Shop</Link>
          <ChevronRight size={12} />
          <Link href={`/shop?category=${product.category}`} className="hover:text-maroon-500">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="text-gray-700 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Images */}
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-2 order-2 sm:order-1">
              {allImages.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(img)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${activeImage === img ? 'border-gold-500 shadow-md' : 'border-transparent'}`}>
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
            <div
              className="flex-1 relative aspect-square rounded-2xl overflow-hidden bg-gray-100 order-1 sm:order-2 cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
            >
              {hasImages ? (
                <>
                  <Image src={activeImage} alt={product.name} fill className="object-cover" priority />
                  {/* Zoom overlay */}
                  {isZooming && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: `url(${activeImage})`,
                        backgroundSize: '250%',
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-maroon-800 to-maroon-500 flex items-center justify-center">
                  <span className="text-white/20 font-serif text-7xl select-none">◆</span>
                </div>
              )}
              {product.stockStatus === 'out_of_stock' && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-semibold">Out of Stock</span>
                </div>
              )}
              {hasImages && !isZooming && (
                <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full pointer-events-none hidden sm:block">
                  Hover to zoom
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 max-w-lg">
            <p className="text-gold-600 text-xs tracking-widest uppercase mb-2 font-medium">{product.collection}</p>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug mb-3">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-5">
              <span className="text-2xl sm:text-3xl font-bold text-maroon-500">
                ${product.price.toLocaleString('en-US')}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    ${product.originalPrice.toLocaleString('en-US')}
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gold-50 rounded-xl border border-gold-100">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Metal</p>
                <p className="text-sm font-semibold text-gray-800">{product.metalType}</p>
              </div>
              <div className="text-center border-x border-gold-200">
                <p className="text-xs text-gray-400 mb-1">Purity</p>
                <p className="text-sm font-semibold text-gray-800">{product.purity}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Weight</p>
                <p className="text-sm font-semibold text-gray-800">{product.weight}</p>
              </div>
            </div>

            {/* Stock */}
            <div className="mb-6">
              {product.stockStatus === 'in_stock' && (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full" /> In Stock — Ready to Ship
                </span>
              )}
              {product.stockStatus === 'limited' && (
                <span className="text-sm text-orange-500 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-orange-500 rounded-full" /> Limited Stock — Order Soon
                </span>
              )}
              {product.stockStatus === 'out_of_stock' && (
                <span className="text-sm text-red-500 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-400 rounded-full" /> Currently Out of Stock
                </span>
              )}
            </div>

            {/* Actions */}
            {!buyable && (
              <p className="text-xs text-gray-500 bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-4">
                This item is available for enquiry only. Chat with us on WhatsApp to arrange your purchase personally.
              </p>
            )}

            <div ref={actionsRef} className="flex gap-3 mb-4">
              {buyable ? (
                <button onClick={handleAddToCart} disabled={product.stockStatus === 'out_of_stock'}
                  className={`flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    added ? 'bg-green-500 text-white'
                    : product.stockStatus === 'out_of_stock' ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-maroon-500 hover:bg-maroon-600 text-white shadow-md hover:shadow-lg'
                  }`}>
                  <ShoppingBag size={18} />
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>
              ) : (
                <a
                  href={getWhatsAppUrl(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle size={18} /> Enquire on WhatsApp
                </a>
              )}
              <button
                onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                  inWishlist ? 'bg-maroon-50 border-maroon-400 text-maroon-500' : 'border-gold-200 text-gray-500 hover:border-maroon-300 hover:text-maroon-500'
                }`}>
                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {buyable && (
              <Link href="/checkout"
                className="block w-full py-3.5 border-2 border-gold-400 text-gold-700 hover:bg-gold-50 rounded-xl font-semibold text-sm text-center transition-all mb-6">
                Buy Now
              </Link>
            )}

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center text-center gap-1 p-3 bg-gray-50 rounded-lg">
                <ShieldCheck size={18} className="text-gold-500" />
                <span className="text-xs text-gray-600">BIS Hallmarked</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 p-3 bg-gray-50 rounded-lg">
                <Truck size={18} className="text-gold-500" />
                <span className="text-xs text-gray-600">Insured Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 p-3 bg-gray-50 rounded-lg">
                <RotateCcw size={18} className="text-gold-500" />
                <span className="text-xs text-gray-600">
                  {isNoExchange ? 'No Returns / Exchange' : 'Exchange in 3 Days'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 lg:mt-16">
          <div className="flex gap-0 border-b border-gold-200">
            {(['description', 'details', 'shipping'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === tab ? 'border-maroon-500 text-maroon-500' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {tab === 'description' ? 'Description' : tab === 'details' ? 'Product Details' : 'Shipping & Returns'}
              </button>
            ))}
          </div>

          <div className="py-6 max-w-2xl">
            {activeTab === 'description' && (
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{product.description}</p>
            )}
            {activeTab === 'details' && (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gold-100">
                  {[
                    ['SKU', product.sku || 'N/A'],
                    ['Category', product.category],
                    ['Collection', product.collection],
                    ['Metal Type', product.metalType],
                    ['Purity', product.purity],
                    ['Gross Weight', product.weight],
                    ['Stock Status', product.stockStatus === 'in_stock' ? 'In Stock' : product.stockStatus === 'limited' ? 'Limited Stock' : 'Out of Stock'],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td className="py-2.5 pr-6 text-gray-400 font-medium w-1/3">{label}</td>
                      <td className="py-2.5 text-gray-700">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-4 text-sm text-gray-600">
                <p><strong>Shipping:</strong> Rates calculated at checkout based on your location via FedEx. Shipping cost is confirmed via WhatsApp or email before dispatch.</p>
                <p><strong>Insurance:</strong> Optional FedEx declared-value insurance available at checkout.</p>
                <p><strong>Pickup:</strong> Free in-store pickup available at our Frisco, TX location (Tue – Sun, 12 noon – 7:30 pm).</p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1.5">
                  <p className="font-semibold text-amber-800">Return & Exchange Policy</p>
                  {isNoExchange ? (
                    <p className="text-amber-700">
                      <strong>All sales are final</strong> for this category — no returns or exchanges are accepted.
                      If you received a defective or incorrect item, please contact us within 24 hours of delivery.
                    </p>
                  ) : (
                    <p className="text-amber-700">
                      <strong>No returns.</strong> Exchange only — within <strong>3 days</strong> of purchase in original condition with invoice.
                      Price difference (based on the gold rate on the day of exchange) must be settled at the time of exchange.
                    </p>
                  )}
                </div>
                <Link href="/policies/returns" className="text-maroon-500 hover:underline text-sm">Read full returns policy →</Link>
              </div>
            )}
          </div>
        </div>

        {/* FAQ */}
        <ProductFAQ isBuyable={buyable} isNoExchange={isNoExchange} />

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12 lg:mt-16">
            <h2 className="font-serif text-2xl font-bold text-maroon-500 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky bottom bar */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 transition-transform duration-300 ${stickyVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 truncate">{product.name}</p>
          <p className="text-sm font-bold text-maroon-500">${product.price.toLocaleString('en-US')}</p>
        </div>
        {buyable ? (
          <button
            onClick={handleAddToCart}
            disabled={product.stockStatus === 'out_of_stock'}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all shrink-0 ${
              added ? 'bg-green-500 text-white'
              : product.stockStatus === 'out_of_stock' ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-maroon-500 text-white'
            }`}
          >
            <ShoppingBag size={16} />
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        ) : (
          <a href={getWhatsAppUrl(product)} target="_blank" rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 bg-green-500 text-white shrink-0">
            <MessageCircle size={16} /> WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}

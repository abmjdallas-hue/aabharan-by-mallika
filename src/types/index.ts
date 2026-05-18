export type Category =
  | 'Necklaces'
  | 'Haram'
  | 'Earrings'
  | 'Bangles'
  | 'Rings'
  | 'Pendants'
  | 'Maang Tikka'
  | 'Vaddanam'
  | 'Bridal Sets'
  | 'Silver Articles'
  | 'Dori'
  | 'Boxes'

export type SilverSubcategory =
  | 'Idols'
  | 'Anklets'
  | 'Toe Rings'
  | 'Baby Bracelets'
  | "Men's Chains"
  | 'Plates'
  | 'Bowls'
  | 'Glasses'
  | 'Diya / Lamps'
  | 'Palavelli'
  | 'Coins'
  | 'Flowers'
  | 'Gift Items'
  | 'Pooja Articles'
  | 'Other'

export const SILVER_SUBCATEGORIES: SilverSubcategory[] = [
  'Idols', 'Anklets', 'Toe Rings', 'Baby Bracelets', "Men's Chains",
  'Plates', 'Bowls', 'Glasses', 'Diya / Lamps', 'Palavelli',
  'Coins', 'Flowers', 'Gift Items', 'Pooja Articles', 'Other',
]

// Only these categories support direct checkout; all others redirect to WhatsApp
export const BUYABLE_CATEGORIES: Category[] = ['Silver Articles', 'Dori', 'Boxes']

export type Collection =
  | 'Antique Jewellery'
  | 'Diamond Jewellery'
  | 'Gold Jewellery'
  | 'Silver Jewellery'
  | 'Temple Jewellery'
  | 'Bridal Collection'
  | 'Lightweight Jewellery'
  | 'Festive Collection'

export interface Product {
  id: string
  name: string
  slug: string
  category: Category
  subcategory?: SilverSubcategory
  collection: Collection
  price: number
  originalPrice?: number
  image: string
  gallery: string[]
  description: string
  metalType: string
  weight: string
  purity: string
  stockStatus: 'in_stock' | 'out_of_stock' | 'limited'
  featured: boolean
  tags?: string[]
  sku?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ShippingAddress {
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
}

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  grandTotal: number
  shippingAddress: ShippingAddress
  paymentMethod: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

export interface FilterState {
  categories: string[]
  collections: string[]
  subcategories: string[]
  priceRange: [number, number]
  sortBy: 'default' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'
  search: string
}

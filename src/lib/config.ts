// ─────────────────────────────────────────────────────────────
//  BUSINESS CONFIG — edit this file to update the entire site
// ─────────────────────────────────────────────────────────────

export const BUSINESS = {
  // ── Brand ──────────────────────────────────────────────────
  name: 'Aabharan by Mallika',
  tagline: 'Crafting timeless jewellery that celebrates every milestone.',

  // ── Contact ────────────────────────────────────────────────
  phone: '+1 (469) 999-1342',
  phoneRaw: '+14699991342',          // used in tel: href — digits + country code only
  email: 'abmjdallas@gmail.com',

  // ── Address ────────────────────────────────────────────────
  addressLine1: '2469 Preston Rd',
  city: 'Frisco',
  state: 'TX',
  zip: '75034',
  country: 'USA',

  // ── Store Hours ────────────────────────────────────────────
  hoursOpen: 'Tue – Sun: 12:00 noon – 7:30 pm',
  hoursClosed: 'Monday: Closed',

  // ── WhatsApp ───────────────────────────────────────────────
  // Digits only with country code (no +, spaces, or dashes)
  whatsappNumber: '14699991342',

  // ── Social Media ───────────────────────────────────────────
  // Leave blank ('') to hide the icon
  instagram: 'https://instagram.com/aabharanbymallika',
  facebook: 'https://www.facebook.com/AabharanJewelry',
  youtube: 'https://www.youtube.com/@MallikaJujjavarapu',

  // ── Payment Details ────────────────────────────────────────
  zelleEmail: '',
  zellePhone: '4699991342',          // Zelle phone number
  venmoHandle: '',                   // e.g. '@AabharanMallika'
  paypalEmail: '',                   // e.g. 'pay@aabharanbymallika.com'
  cashappHandle: '',                 // e.g. '$AabharanMallika'

  // ── Shipping Zones ─────────────────────────────────────────
  // Zones are checked top-to-bottom; first match wins.
  // Leave states: [] on the last entry — it acts as the catch-all for all other states.
  // Change the rates (USD) to whatever you charge.
  shippingZones: [
    {
      label: 'Texas',
      states: ['Texas'],
      rate: 12,
    },
    {
      label: 'Nearby states (OK / LA / NM / AR / CO)',
      states: ['Oklahoma', 'Louisiana', 'New Mexico', 'Arkansas', 'Colorado'],
      rate: 20,
    },
    {
      label: 'Rest of USA',
      states: [] as string[],   // catch-all — keep this last
      rate: 30,
    },
  ],

  // ── Default Package (used for FedEx rate calculation) ──────
  // Adjust if your typical jewellery shipment differs
  packageWeightLb: 1,                // pounds — most jewellery ships under 1 lb
  packageDimensions: { length: 8, width: 6, height: 4 },  // inches

  // ── Tax ────────────────────────────────────────────────────
  taxRate: 0.08,                     // 8%
}

// Convenience helpers
export const fullAddress = `${BUSINESS.addressLine1}, ${BUSINESS.city}, ${BUSINESS.state} ${BUSINESS.zip}, ${BUSINESS.country}`
export const whatsappBaseUrl = `https://wa.me/${BUSINESS.whatsappNumber}`

/** Returns the shipping cost for a given US state name, or null if state not yet selected. */
export function getShippingForState(state: string): { cost: number; label: string } | null {
  if (!state) return null
  const zone = BUSINESS.shippingZones.find(
    (z) => z.states.length === 0 || z.states.includes(state)
  )
  return zone ? { cost: zone.rate, label: zone.label } : null
}

/**
 * FedEx declared-value insurance cost.
 * First $100 is covered free; above that: $0.90 per $100 (min $2.70).
 */
export function calcInsurance(declaredValue: number): number {
  if (declaredValue <= 100) return 0
  const increments = Math.ceil((declaredValue - 100) / 100)
  return Math.round(Math.max(2.70, increments * 0.90) * 100) / 100
}

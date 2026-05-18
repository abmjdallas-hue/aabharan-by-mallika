const BASE = process.env.FEDEX_SANDBOX !== 'false'
  ? 'https://apis-sandbox.fedex.com'
  : 'https://apis.fedex.com'

const STATE_CODES: Record<string, string> = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS',
  'Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA',
  'Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT',
  'Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM',
  'New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK',
  'Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
  'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
  'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY',
  'Washington D.C.':'DC',
}

async function getToken(): Promise<string> {
  const res = await fetch(`${BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.FEDEX_API_KEY!,
      client_secret: process.env.FEDEX_SECRET_KEY!,
    }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`FedEx auth failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

export interface ShipRequest {
  recipientName: string
  recipientPhone: string
  address: string
  city: string
  state: string
  zip: string
  serviceType: string
  weightLb?: number
}

export interface ShipResult {
  trackingNumber: string
  labelUrl?: string
}

export async function createFedExShipment(req: ShipRequest): Promise<ShipResult> {
  const token = await getToken()
  const stateCode = STATE_CODES[req.state] ?? req.state.slice(0, 2).toUpperCase()
  const today = new Date().toISOString().split('T')[0]

  const body = {
    labelResponseOptions: 'URL_ONLY',
    requestedShipment: {
      shipper: {
        contact: {
          personName: 'Mallika',
          phoneNumber: (process.env.FEDEX_ORIGIN_PHONE ?? '4699991342').replace(/\D/g, ''),
          companyName: 'Aabharan by Mallika',
        },
        address: {
          streetLines: ['2469 Preston Rd'],
          city: 'Frisco',
          stateOrProvinceCode: 'TX',
          postalCode: process.env.FEDEX_ORIGIN_ZIP ?? '75034',
          countryCode: 'US',
        },
      },
      recipients: [{
        contact: {
          personName: req.recipientName,
          phoneNumber: req.recipientPhone.replace(/\D/g, '').slice(-10),
        },
        address: {
          streetLines: [req.address],
          city: req.city,
          stateOrProvinceCode: stateCode,
          postalCode: req.zip,
          countryCode: 'US',
          residential: true,
        },
      }],
      shipDatestamp: today,
      serviceType: req.serviceType,
      packagingType: 'YOUR_PACKAGING',
      pickupType: 'DROPOFF_AT_FEDEX_LOCATION',
      shippingChargesPayment: {
        paymentType: 'SENDER',
        payor: {
          responsibleParty: {
            accountNumber: { value: process.env.FEDEX_ACCOUNT_NUMBER! },
          },
        },
      },
      labelSpecification: {
        imageType: 'PDF',
        labelStockType: 'PAPER_4X6',
      },
      requestedPackageLineItems: [{
        weight: { units: 'LB', value: Math.max(0.1, req.weightLb ?? 1) },
      }],
    },
  }

  const res = await fetch(`${BASE}/ship/v1/shipments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-locale': 'en_US',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`FedEx ship failed ${res.status}: ${txt.slice(0, 300)}`)
  }

  const data = await res.json()
  const shipment = data.output?.transactionShipments?.[0]
  const pkg = shipment?.pieceResponses?.[0]
  const trackingNumber = pkg?.trackingNumber ?? shipment?.masterTrackingNumber

  if (!trackingNumber) throw new Error('No tracking number in FedEx response')

  return {
    trackingNumber,
    labelUrl: pkg?.packageDocuments?.[0]?.url,
  }
}

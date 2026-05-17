import { NextRequest, NextResponse } from 'next/server'

const FEDEX_API_KEY = process.env.FEDEX_API_KEY
const FEDEX_SECRET_KEY = process.env.FEDEX_SECRET_KEY
const FEDEX_ACCOUNT_NUMBER = process.env.FEDEX_ACCOUNT_NUMBER
const IS_SANDBOX = process.env.FEDEX_SANDBOX !== 'false'

const BASE = IS_SANDBOX ? 'https://apis-sandbox.fedex.com' : 'https://apis.fedex.com'

const SERVICE_NAMES: Record<string, string> = {
  GROUND_HOME_DELIVERY:  'FedEx Home Delivery',
  FEDEX_GROUND:          'FedEx Ground',
  FEDEX_EXPRESS_SAVER:   'FedEx Express Saver (3 days)',
  FEDEX_2_DAY:           'FedEx 2Day',
  FEDEX_2_DAY_AM:        'FedEx 2Day AM',
  STANDARD_OVERNIGHT:    'FedEx Standard Overnight',
  PRIORITY_OVERNIGHT:    'FedEx Priority Overnight',
  FIRST_OVERNIGHT:       'FedEx First Overnight',
}

async function getToken(): Promise<string> {
  const res = await fetch(`${BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: FEDEX_API_KEY!,
      client_secret: FEDEX_SECRET_KEY!,
    }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`FedEx auth failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

export async function POST(req: NextRequest) {
  if (!FEDEX_API_KEY || !FEDEX_SECRET_KEY || !FEDEX_ACCOUNT_NUMBER) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 })
  }

  let body: { destinationZip: string; weightLb?: number; declaredValue?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { destinationZip, weightLb = 1, declaredValue = 0 } = body

  if (!/^\d{5}$/.test(destinationZip)) {
    return NextResponse.json({ error: 'Invalid ZIP code' }, { status: 400 })
  }

  try {
    const token = await getToken()

    const rateBody = {
      accountNumber: { value: FEDEX_ACCOUNT_NUMBER },
      requestedShipment: {
        shipper: {
          address: {
            postalCode: process.env.FEDEX_ORIGIN_ZIP ?? '75034',
            countryCode: 'US',
          },
        },
        recipient: {
          address: {
            postalCode: destinationZip,
            countryCode: 'US',
            residential: true,
          },
        },
        pickupType: 'DROPOFF_AT_FEDEX_LOCATION',
        packagingType: 'YOUR_PACKAGING',
        requestedPackageLineItems: [
          {
            weight: { units: 'LB', value: Math.max(0.1, weightLb) },
            dimensions: { length: 8, width: 6, height: 4, units: 'IN' },
            ...(declaredValue > 100
              ? { declaredValue: { amount: declaredValue, currency: 'USD' } }
              : {}),
          },
        ],
        rateRequestType: ['LIST', 'ACCOUNT'],
      },
    }

    const rateRes = await fetch(`${BASE}/rate/v1/rates/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-locale': 'en_US',
      },
      body: JSON.stringify(rateBody),
      cache: 'no-store',
    })

    if (!rateRes.ok) {
      const errText = await rateRes.text()
      throw new Error(`FedEx rate API ${rateRes.status}: ${errText.slice(0, 200)}`)
    }

    const data = await rateRes.json()
    const details = data.output?.rateReplyDetails ?? []

    const rates = details
      .map((r: Record<string, unknown>) => {
        const shipDetails = (r.ratedShipmentDetails as Record<string, unknown>[])?.[0]
        const price = Number(shipDetails?.totalNetCharge ?? 0)
        const serviceType = r.serviceType as string
        const commit = r.commit as Record<string, unknown> | undefined
        const dateDetail = commit?.dateDetail as Record<string, unknown> | undefined
        return {
          service: serviceType,
          name: SERVICE_NAMES[serviceType] ?? serviceType.replace(/_/g, ' '),
          price: Math.round(price * 100) / 100,
          deliveryDate: dateDetail?.dayOfWeek as string | undefined,
        }
      })
      .filter((r: { price: number }) => r.price > 0)
      .sort((a: { price: number }, b: { price: number }) => a.price - b.price)

    return NextResponse.json({ rates })
  } catch (err) {
    console.error('[FedEx Rates]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

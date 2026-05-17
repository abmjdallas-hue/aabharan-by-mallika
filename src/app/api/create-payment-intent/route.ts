import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY ?? ''

export async function POST(req: NextRequest) {
  if (!key || key.startsWith('your_')) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 })
  }

  const stripe = new Stripe(key)

  let body: { amountCents: number; shipping?: { name: string; address: string; city: string; state: string; zip: string } }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { amountCents, shipping } = body

  if (!amountCents || amountCents < 5000) {
    return NextResponse.json({ error: 'Minimum $50 required for card / Affirm payments' }, { status: 400 })
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      payment_method_types: ['card', 'affirm'],
      ...(shipping?.name ? {
        shipping: {
          name: shipping.name,
          address: {
            line1: shipping.address,
            city: shipping.city,
            state: shipping.state,
            postal_code: shipping.zip,
            country: 'US',
          },
        },
      } : {}),
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('[PaymentIntent]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

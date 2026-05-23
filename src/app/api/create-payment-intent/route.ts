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

  if (!amountCents || amountCents < 50) {
    return NextResponse.json({ error: 'Amount too low' }, { status: 400 })
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      // Affirm requires minimum $50 — include it only when eligible
      payment_method_types: amountCents >= 5000 ? ['card', 'affirm'] : ['card'],
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

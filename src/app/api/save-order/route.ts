import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

export async function POST(req: NextRequest) {
  let body: {
    paymentIntentId: string
    customerEmail: string
    customerName: string
    phone: string
    deliveryMethod: string
    shippingAddress: Record<string, string> | null
    items: { name: string; quantity: number; price: number }[]
    subtotal: number
    shippingCost: number
    tax: number
    total: number
    selectedService: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const orderNumber = `ABM${Date.now()}`

  const { error } = await supabaseAdmin.from('orders').insert({
    order_number: orderNumber,
    stripe_payment_intent_id: body.paymentIntentId,
    customer_email: body.customerEmail,
    customer_name: body.customerName,
    phone: body.phone,
    delivery_method: body.deliveryMethod,
    shipping_address: body.shippingAddress,
    items: body.items,
    subtotal: body.subtotal,
    shipping_cost: body.shippingCost,
    tax: body.tax,
    total: body.total,
    selected_service: body.selectedService,
    status: 'pending',
  })

  if (error) {
    console.error('[save-order]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Tag the PaymentIntent so the webhook can look up this order
  try {
    await stripe.paymentIntents.update(body.paymentIntentId, {
      metadata: { order_number: orderNumber },
    })
  } catch (err) {
    console.error('[stripe metadata update]', err)
  }

  return NextResponse.json({ orderNumber })
}

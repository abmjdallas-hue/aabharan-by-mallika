import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'
import { sendOrderConfirmationEmail, sendOwnerNotificationEmail } from '@/lib/email'
import { BUSINESS } from '@/lib/config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

export async function POST(req: NextRequest) {
  let body: {
    paymentIntentId: string | null
    paymentType: string
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
  const paymentType = body.paymentType ?? 'card'

  const { error } = await supabaseAdmin.from('orders').insert({
    order_number: orderNumber,
    stripe_payment_intent_id: body.paymentIntentId ?? null,
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
    payment_type: paymentType,
    status: 'pending',
  })

  if (error) {
    console.error('[save-order]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Tag the PaymentIntent so the webhook can look up this order (card only)
  if (body.paymentIntentId) {
    try {
      await stripe.paymentIntents.update(body.paymentIntentId, {
        metadata: { order_number: orderNumber },
      })
    } catch (err) {
      console.error('[stripe metadata update]', err)
    }
  }

  // For Zelle/COD orders the webhook never fires — send emails immediately
  if (paymentType !== 'card') {
    const emailParams = {
      orderNumber,
      customerName: body.customerName,
      items: body.items,
      subtotal: body.subtotal,
      shippingCost: body.shippingCost,
      tax: body.tax,
      total: body.total,
      deliveryMethod: body.deliveryMethod,
    }
    try {
      await sendOrderConfirmationEmail({ to: body.customerEmail, ...emailParams })
    } catch (err) {
      console.error('[customer email]', err)
    }
    try {
      await sendOwnerNotificationEmail({
        ownerEmail: BUSINESS.email,
        customerEmail: body.customerEmail,
        customerPhone: body.phone,
        paymentType,
        shippingAddress: body.shippingAddress as { address: string; city: string; state: string; zip: string } | null,
        selectedService: body.selectedService,
        ...emailParams,
      })
    } catch (err) {
      console.error('[owner email]', err)
    }
  }

  return NextResponse.json({ orderNumber })
}

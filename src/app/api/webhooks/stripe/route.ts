import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { createFedExShipment } from '@/lib/fedex-ship'
import { sendOrderConfirmationEmail } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ''

// Required: disable body parsing so we can verify the raw signature
export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('[webhook] signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'payment_intent.succeeded') {
    return NextResponse.json({ received: true })
  }

  const pi = event.data.object as Stripe.PaymentIntent
  const orderNumber = pi.metadata?.order_number

  if (!orderNumber) {
    console.error('[webhook] no order_number in PI metadata', pi.id)
    return NextResponse.json({ received: true })
  }

  // Fetch the order
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single()

  if (error || !order) {
    console.error('[webhook] order not found', orderNumber)
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Mark paid
  await supabaseAdmin.from('orders').update({ status: 'paid' }).eq('order_number', orderNumber)

  let trackingNumber: string | undefined

  // Auto-create FedEx label for shipped orders
  if (order.delivery_method === 'ship' && order.shipping_address) {
    try {
      const result = await createFedExShipment({
        recipientName: order.customer_name,
        recipientPhone: order.phone ?? '',
        address: order.shipping_address.address,
        city: order.shipping_address.city,
        state: order.shipping_address.state,
        zip: order.shipping_address.zip,
        serviceType: order.selected_service ?? 'FEDEX_GROUND',
      })
      trackingNumber = result.trackingNumber

      await supabaseAdmin.from('orders').update({
        fedex_tracking_number: trackingNumber,
        fedex_label_url: result.labelUrl ?? null,
        status: 'label_created',
      }).eq('order_number', orderNumber)
    } catch (err) {
      console.error('[FedEx Ship]', err)
      await supabaseAdmin.from('orders')
        .update({ status: 'paid_label_failed' })
        .eq('order_number', orderNumber)
    }
  }

  // Send confirmation email
  try {
    await sendOrderConfirmationEmail({
      to: order.customer_email,
      customerName: order.customer_name,
      orderNumber,
      items: order.items,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      tax: order.tax,
      total: order.total,
      trackingNumber,
      deliveryMethod: order.delivery_method,
    })
  } catch (err) {
    console.error('[Email]', err)
  }

  return NextResponse.json({ received: true })
}

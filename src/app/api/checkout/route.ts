import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    const subtotal = items.reduce(
      (sum: number, item: { product: { price: number }; quantity: number }) =>
        sum + item.product.price * item.quantity,
      0
    )
    const shipping = subtotal >= 5000 ? 0 : 250
    const tax = Math.round(subtotal * 0.03)
    const grandTotal = subtotal + shipping + tax

    // Stripe integration placeholder
    // To enable Stripe, uncomment and configure:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })
    // const session = await stripe.checkout.sessions.create({ ... })
    // return NextResponse.json({ url: session.url })

    const orderId = `ABM${Date.now()}`
    return NextResponse.json({
      success: true,
      orderId,
      grandTotal,
      message: 'Order placed successfully. Stripe not yet configured.',
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}

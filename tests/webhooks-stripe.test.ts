import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Runs the real Stripe webhook handler against a simulated
 * `payment_intent.succeeded` event, with every outbound dependency stubbed
 * (Stripe signature check, Supabase, FedEx, Resend email).
 *
 * Covers both fulfillment paths:
 *   - shipped order  -> FedEx label created, fresh labelUrl reaches owner email
 *     (regression guard for bb64e06)
 *   - pickup order   -> no FedEx call, owner email gets no label/tracking
 */

const FRESH_LABEL_URL = 'https://fedex.example/label/TESTTRACK123.pdf'
const STALE_LABEL_URL_IN_DB = null // order.fedex_label_url before the label exists

// Spies + a mutable order holder, created via vi.hoisted so the hoisted vi.mock
// factories can reference them.
const { ownerSpy, customerSpy, fedexSpy, dbUpdates, orderRef } = vi.hoisted(() => ({
  ownerSpy: vi.fn(async (_p: { labelUrl?: string; trackingNumber?: string }) => {}),
  customerSpy: vi.fn(async (_p: { trackingNumber?: string }) => {}),
  fedexSpy: vi.fn(async () => ({
    trackingNumber: 'TESTTRACK123',
    labelUrl: 'https://fedex.example/label/TESTTRACK123.pdf',
  })),
  dbUpdates: [] as Array<Record<string, unknown>>,
  orderRef: { current: null as Record<string, unknown> | null },
}))

const baseOrder = {
  order_number: 'ABMTEST0001',
  customer_name: 'Test Customer',
  customer_email: 'customer@test.local',
  phone: '4695551234',
  selected_service: 'FEDEX_GROUND',
  items: [{ name: 'Silver Bangle', quantity: 1, price: 49 }],
  subtotal: 49, shipping_cost: 10, tax: 4, total: 63,
  fedex_label_url: STALE_LABEL_URL_IN_DB,
}

const shipOrder = {
  ...baseOrder,
  delivery_method: 'ship',
  shipping_address: { address: '123 Test St', city: 'Dallas', state: 'Texas', zip: '75201' },
}

const pickupOrder = {
  ...baseOrder,
  delivery_method: 'pickup',
  shipping_address: null,
}

// Stripe: skip signature verification, return our event.
vi.mock('stripe', () => ({
  default: class FakeStripe {
    webhooks = {
      constructEvent: () => ({
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_123', metadata: { order_number: 'ABMTEST0001' } } },
      }),
    }
  },
}))

// Supabase: serve whatever order the current test set, record updates.
vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: orderRef.current, error: null }) }) }),
      update: (patch: Record<string, unknown>) => {
        dbUpdates.push(patch)
        return { eq: async () => ({ error: null }) }
      },
    }),
  },
}))

// FedEx: fresh label result, no real shipment.
vi.mock('@/lib/fedex-ship', () => ({ createFedExShipment: fedexSpy }))

// Email: capture args, send nothing.
vi.mock('@/lib/email', () => ({
  sendOrderConfirmationEmail: customerSpy,
  sendOwnerNotificationEmail: ownerSpy,
}))

// Config: stable owner email.
vi.mock('@/lib/config', () => ({ BUSINESS: { email: 'owner@test.local' } }))

function fakeRequest() {
  return {
    text: async () => JSON.stringify({ ignored: true }),
    headers: { get: () => 'fake-signature' },
  } as unknown as import('next/server').NextRequest
}

describe('Stripe webhook — payment_intent.succeeded', () => {
  beforeEach(() => {
    ownerSpy.mockClear()
    customerSpy.mockClear()
    fedexSpy.mockClear()
    dbUpdates.length = 0
  })

  it('shipped order: passes the FRESH FedEx label URL to the owner email (regression: bb64e06)', async () => {
    orderRef.current = { ...shipOrder }
    const { POST } = await import('@/app/api/webhooks/stripe/route')
    const res = await POST(fakeRequest())

    expect(res.status).toBe(200)
    expect(fedexSpy).toHaveBeenCalledTimes(1)
    expect(ownerSpy).toHaveBeenCalledTimes(1)

    const ownerArg = ownerSpy.mock.calls[0][0]

    // The fix: owner email gets the fresh result URL...
    expect(ownerArg.labelUrl).toBe(FRESH_LABEL_URL)
    expect(ownerArg.trackingNumber).toBe('TESTTRACK123')
    // ...NOT the stale DB field that was null before the label existed.
    expect(ownerArg.labelUrl).not.toBe(STALE_LABEL_URL_IN_DB)

    // And the DB was updated with the same fresh label URL + tracking.
    const labelUpdate = dbUpdates.find((u) => 'fedex_label_url' in u)
    expect(labelUpdate?.fedex_label_url).toBe(FRESH_LABEL_URL)
    expect(labelUpdate?.status).toBe('label_created')
  })

  it('pickup order: skips FedEx and sends emails with no label or tracking', async () => {
    orderRef.current = { ...pickupOrder }
    const { POST } = await import('@/app/api/webhooks/stripe/route')
    const res = await POST(fakeRequest())

    expect(res.status).toBe(200)

    // No shipment is created for pickup orders.
    expect(fedexSpy).not.toHaveBeenCalled()

    // Both emails still go out, with no label/tracking info.
    expect(customerSpy).toHaveBeenCalledTimes(1)
    expect(ownerSpy).toHaveBeenCalledTimes(1)

    const ownerArg = ownerSpy.mock.calls[0][0]
    expect(ownerArg.labelUrl).toBeUndefined()
    expect(ownerArg.trackingNumber).toBeUndefined()
    expect(customerSpy.mock.calls[0][0].trackingNumber).toBeUndefined()

    // Order is marked paid, but never advances to a label/shipping status.
    expect(dbUpdates.some((u) => u.status === 'paid')).toBe(true)
    expect(dbUpdates.some((u) => 'fedex_label_url' in u)).toBe(false)
    expect(dbUpdates.some((u) => u.status === 'label_created')).toBe(false)
  })
})

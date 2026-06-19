import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Runs the real Stripe webhook handler against a simulated
 * `payment_intent.succeeded` event for a shipped order, with every outbound
 * dependency stubbed (Stripe signature check, Supabase, FedEx, Resend email).
 *
 * Regression guard for the bug fixed in bb64e06: the owner-notification email
 * must receive the FRESH FedEx label URL returned by createFedExShipment, not
 * the stale order.fedex_label_url field (which is null before the label is
 * created earlier in the same request).
 */

const FRESH_LABEL_URL = 'https://fedex.example/label/TESTTRACK123.pdf'
const STALE_LABEL_URL_IN_DB = null // order.fedex_label_url before the label exists

// Spies created via vi.hoisted so the hoisted vi.mock factories can reference them.
const { ownerSpy, customerSpy, fedexSpy, dbUpdates } = vi.hoisted(() => ({
  ownerSpy: vi.fn(async (_p: { labelUrl?: string; trackingNumber?: string }) => {}),
  customerSpy: vi.fn(async (_p: Record<string, unknown>) => {}),
  fedexSpy: vi.fn(async () => ({
    trackingNumber: 'TESTTRACK123',
    labelUrl: 'https://fedex.example/label/TESTTRACK123.pdf',
  })),
  dbUpdates: [] as Array<Record<string, unknown>>,
}))

const fakeOrder = {
  order_number: 'ABMTEST0001',
  customer_name: 'Test Customer',
  customer_email: 'customer@test.local',
  phone: '4695551234',
  delivery_method: 'ship',
  shipping_address: { address: '123 Test St', city: 'Dallas', state: 'Texas', zip: '75201' },
  selected_service: 'FEDEX_GROUND',
  items: [{ name: 'Silver Bangle', quantity: 1, price: 49 }],
  subtotal: 49, shipping_cost: 10, tax: 4, total: 63,
  fedex_label_url: STALE_LABEL_URL_IN_DB,
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

// Supabase: serve the fake order, record updates.
vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: fakeOrder, error: null }) }) }),
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

describe('Stripe webhook — shipped order label flow', () => {
  beforeEach(() => {
    ownerSpy.mockClear()
    customerSpy.mockClear()
    fedexSpy.mockClear()
    dbUpdates.length = 0
  })

  it('passes the FRESH FedEx label URL to the owner email (regression: bb64e06)', async () => {
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
})

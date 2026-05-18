import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.SENDER_EMAIL ?? 'orders@aabharanbymallikausa.com'

interface OrderEmailParams {
  to: string
  customerName: string
  orderNumber: string
  items: { name: string; quantity: number; price: number }[]
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  trackingNumber?: string
  deliveryMethod: string
}

export async function sendOrderConfirmationEmail(p: OrderEmailParams) {
  const rows = p.items.map(i =>
    `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0e6d3;font-size:14px;">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0e6d3;text-align:center;font-size:14px;">${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0e6d3;text-align:right;font-size:14px;">$${(i.price * i.quantity).toLocaleString('en-US')}</td>
    </tr>`
  ).join('')

  const trackingBlock = p.trackingNumber
    ? `<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-weight:bold;color:#166534;font-family:Arial,sans-serif;font-size:14px;">Your order has been shipped!</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#1f2937;">
          FedEx Tracking: <strong>${p.trackingNumber}</strong>
        </p>
        <a href="https://www.fedex.com/fedextrack/?tracknumbers=${p.trackingNumber}"
           style="display:inline-block;margin-top:12px;padding:8px 16px;background:#7c2d12;color:white;text-decoration:none;border-radius:6px;font-size:13px;font-family:Arial,sans-serif;">
          Track Your Package →
        </a>
      </div>`
    : p.deliveryMethod === 'pickup'
    ? `<div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:16px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-weight:bold;color:#92400e;font-family:Arial,sans-serif;font-size:14px;">Ready for Pickup</p>
        <p style="margin:0;font-size:13px;color:#78350f;font-family:Arial,sans-serif;">2469 Preston Rd, Frisco TX 75034 · Tue–Sun 12–7:30 pm</p>
      </div>`
    : ''

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Georgia,serif;background:#faf6f0;margin:0;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="background:#7c2d12;padding:32px;text-align:center;">
    <h1 style="color:#f6c90e;font-size:28px;margin:0;letter-spacing:2px;">Aabharan</h1>
    <p style="color:#f6c90e;margin:4px 0 0;font-size:12px;letter-spacing:4px;font-family:Arial,sans-serif;">by Mallika</p>
  </div>
  <div style="padding:32px;">
    <h2 style="color:#1f2937;margin:0 0 8px;font-size:22px;">Order Confirmed!</h2>
    <p style="color:#6b7280;margin:0 0 24px;font-family:Arial,sans-serif;font-size:14px;">
      Thank you, ${p.customerName}. Your order <strong>#${p.orderNumber}</strong> has been confirmed.
    </p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <thead>
        <tr style="border-bottom:2px solid #f6c90e;">
          <th style="text-align:left;padding:8px 0;font-size:11px;color:#6b7280;font-family:Arial,sans-serif;text-transform:uppercase;">Item</th>
          <th style="text-align:center;padding:8px 0;font-size:11px;color:#6b7280;font-family:Arial,sans-serif;text-transform:uppercase;">Qty</th>
          <th style="text-align:right;padding:8px 0;font-size:11px;color:#6b7280;font-family:Arial,sans-serif;text-transform:uppercase;">Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="background:#faf6f0;border-radius:8px;padding:16px;margin-bottom:24px;font-family:Arial,sans-serif;font-size:14px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#6b7280;">Subtotal</span><span>$${p.subtotal.toLocaleString('en-US')}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#6b7280;">Shipping</span><span>${p.shippingCost === 0 ? 'Free (Pickup)' : '$' + p.shippingCost.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#6b7280;">Tax</span><span>$${p.tax.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;border-top:1px solid #e5d5b5;padding-top:8px;font-weight:bold;color:#7c2d12;font-size:16px;"><span>Total</span><span>$${p.total.toLocaleString('en-US')}</span></div>
    </div>
    ${trackingBlock}
    <p style="font-size:13px;color:#6b7280;font-family:Arial,sans-serif;line-height:1.6;">
      Questions? WhatsApp us at +1 (469) 999-1342.
    </p>
  </div>
  <div style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #f0e6d3;">
    <p style="margin:0;font-size:12px;color:#9ca3af;font-family:Arial,sans-serif;">
      © ${new Date().getFullYear()} Aabharan by Mallika · 2469 Preston Rd, Frisco TX 75034
    </p>
  </div>
</div>
</body></html>`

  await resend.emails.send({
    from: FROM,
    to: p.to,
    subject: `Order Confirmed #${p.orderNumber} — Aabharan by Mallika`,
    html,
  })
}

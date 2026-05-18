import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Aabharan by Mallika. Visit our store in Frisco, TX or reach us via WhatsApp, phone or email. Open Tuesday – Sunday, 12 noon – 7:30 pm.',
  alternates: { canonical: 'https://aabharanbymallikausa.com/contact' },
  openGraph: {
    title: 'Contact — Aabharan by Mallika',
    description: 'Visit us in Frisco, TX or connect via WhatsApp & email. Open Tue–Sun, 12–7:30 pm.',
    url: 'https://aabharanbymallikausa.com/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

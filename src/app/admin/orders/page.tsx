'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Store, Package, ExternalLink, RefreshCw } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  order_number: string
  created_at: string
  customer_name: string
  customer_email: string
  phone: string
  delivery_method: string
  items: { name: string; quantity: number; price: number }[]
  subtotal: number
  shipping_cost: number
  tax: number
  total: number
  selected_service: string
  fedex_tracking_number: string | null
  fedex_label_url: string | null
  status: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  label_created: 'bg-purple-100 text-purple-700',
  shipped: 'bg-green-100 text-green-700',
  delivered: 'bg-gray-100 text-gray-700',
  paid_label_failed: 'bg-red-100 text-red-700',
}

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) router.replace('/admin')
  }, [user, authLoading, router])

  const fetchOrders = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/orders')
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const markShipped = async (orderNumber: string) => {
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber, status: 'shipped' }),
    })
    fetchOrders()
  }

  if (authLoading || loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-400">Loading…</div></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <div className="font-serif text-xl font-bold text-gold-400">Aabharan Admin</div>
          <div className="text-xs text-gray-400">Orders</div>
        </div>
        <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
          <Store size={12} /> View Store
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-sm text-gray-500 hover:text-maroon-500">Dashboard</Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-xl font-bold text-gray-800">Orders</h1>
          </div>
          <button onClick={fetchOrders} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-maroon-500 transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="text-left px-5 py-3">Order</th>
                    <th className="text-left px-5 py-3">Customer</th>
                    <th className="text-left px-5 py-3">Items</th>
                    <th className="text-left px-5 py-3">Total</th>
                    <th className="text-left px-5 py-3">Delivery</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Tracking</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">{order.order_number}</p>
                        <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.customer_email}</p>
                        <p className="text-xs text-gray-400">{order.phone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          {order.items?.map((item, i) => (
                            <p key={i} className="text-xs text-gray-600">{item.quantity}× {item.name}</p>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-800">${order.total?.toLocaleString('en-US')}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.delivery_method === 'pickup' ? 'bg-gold-100 text-gold-700' : 'bg-blue-100 text-blue-700'}`}>
                          {order.delivery_method === 'pickup' ? 'Pickup' : order.selected_service?.replace(/_/g, ' ') ?? 'Ship'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {order.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {order.fedex_tracking_number ? (
                          <div>
                            <p className="text-xs font-mono text-gray-800">{order.fedex_tracking_number}</p>
                            <a
                              href={`https://www.fedex.com/fedextrack/?tracknumbers=${order.fedex_tracking_number}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-maroon-500 hover:underline flex items-center gap-0.5 mt-0.5"
                            >
                              Track <ExternalLink size={10} />
                            </a>
                            {order.fedex_label_url && (
                              <a href={order.fedex_label_url} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline flex items-center gap-0.5">
                                Print Label <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {order.status === 'label_created' && (
                          <button
                            onClick={() => markShipped(order.order_number)}
                            className="text-xs px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                          >
                            Mark Shipped
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

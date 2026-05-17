'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, ChevronDown, ChevronUp, LayoutDashboard, LogOut, ShoppingBag, Heart } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface NavLink {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

interface Props {
  isOpen: boolean
  onClose: () => void
  links: NavLink[]
}

export default function MobileMenu({ isOpen, onClose, links }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const { user, logout } = useAuth()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72 bg-ivory shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gold-200">
          <div>
            <div className="font-serif text-xl font-bold text-maroon-500">Aabharan</div>
            <div className="text-xs text-gold-600 tracking-widest">by Mallika</div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-600">
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {links.map((link) => (
            <div key={link.label}>
              <div className="flex items-center justify-between">
                <Link
                  href={link.href}
                  onClick={!link.children ? onClose : undefined}
                  className="flex-1 px-5 py-3 text-sm font-medium text-gray-800 hover:text-maroon-500 hover:bg-gold-50 transition-colors"
                >
                  {link.label}
                </Link>
                {link.children && (
                  <button
                    onClick={() => setExpanded(expanded === link.label ? null : link.label)}
                    className="px-4 py-3 text-gray-500"
                  >
                    {expanded === link.label ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                )}
              </div>
              {link.children && expanded === link.label && (
                <div className="bg-gold-50 border-l-2 border-gold-400 ml-5">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      onClick={onClose}
                      className="block px-5 py-2.5 text-sm text-gray-600 hover:text-maroon-500 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-gold-200 p-4 space-y-1">
          {user ? (
            <>
              <div className="px-2 py-2 mb-1">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <Link href="/cart" onClick={onClose}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gold-50 hover:text-maroon-500 rounded-lg transition-colors">
                <ShoppingBag size={15} /> My Cart
              </Link>
              <Link href="/wishlist" onClick={onClose}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gold-50 hover:text-maroon-500 rounded-lg transition-colors">
                <Heart size={15} /> My Wishlist
              </Link>
              {user.isAdmin && (
                <Link href="/admin" onClick={onClose}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gold-700 font-medium hover:bg-gold-50 rounded-lg transition-colors">
                  <LayoutDashboard size={15} /> Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => { logout(); onClose() }}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={onClose}
                className="block w-full text-center py-2 px-4 border border-maroon-500 text-maroon-500 rounded text-sm font-medium hover:bg-maroon-50 transition-colors">
                Login
              </Link>
              <Link href="/register" onClick={onClose}
                className="block w-full text-center py-2 px-4 bg-maroon-500 text-white rounded text-sm font-medium hover:bg-maroon-600 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

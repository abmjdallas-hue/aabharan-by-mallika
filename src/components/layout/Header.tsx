'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'
import { Search, Heart, ShoppingBag, User, Menu, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import SearchModal from '@/components/ui/SearchModal'
import MobileMenu from './MobileMenu'
import { isStoreOpen } from '@/lib/config'
import { useStoreHours } from '@/hooks/useStoreHours'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  {
    label: 'Collections',
    href: '/shop',
    children: [
      { label: 'Antique Jewellery', href: '/shop?collection=Antique+Jewellery' },
      { label: 'Diamond Jewellery', href: '/shop?collection=Diamond+Jewellery' },
      { label: 'Gold Jewellery', href: '/shop?collection=Gold+Jewellery' },
      { label: 'Temple Jewellery', href: '/shop?collection=Temple+Jewellery' },
      { label: 'Bridal Collection', href: '/shop?collection=Bridal+Collection' },
      { label: 'Lightweight Jewellery', href: '/shop?collection=Lightweight+Jewellery' },
      { label: 'Festive Collection', href: '/shop?collection=Festive+Collection' },
      { label: 'Silver Articles', href: '/shop?category=Silver+Articles' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book Appointment', href: '/appointment' },
]

export default function Header() {
  const { totalItems } = useCart()
  const { totalItems: wishlistCount } = useWishlist()
  const { user, logout } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [storeOpen, setStoreOpen] = useState(false)
  const { hours } = useStoreHours()

  useEffect(() => {
    setStoreOpen(isStoreOpen(hours))
    const interval = setInterval(() => setStoreOpen(isStoreOpen(hours)), 60_000)
    return () => clearInterval(interval)
  }, [hours])
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const visibleLinks = navLinks.filter(l => l.label !== 'Book Appointment' || storeOpen)

  return (
    <>
      <header className="sticky top-0 z-50 bg-ivory border-b border-gold-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-maroon-500"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex flex-col items-center">
              <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-maroon-500 tracking-wide leading-tight">
                Aabharan
              </span>
              <span className="text-xs sm:text-sm text-gold-600 tracking-[0.2em] font-light">
                by Mallika
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {user?.isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-gold-700 hover:text-maroon-500 transition-colors py-2 flex items-center gap-1"
                >
                  <LayoutDashboard size={14} /> Admin
                </Link>
              )}
              {visibleLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={link.label === 'Book Appointment'
                      ? "text-xs font-semibold px-3 py-1.5 bg-maroon-500 hover:bg-maroon-600 text-white rounded-full transition-colors flex items-center gap-1"
                      : "text-sm font-medium text-gray-700 hover:text-maroon-500 transition-colors py-2 flex items-center gap-1"
                    }
                  >
                    {link.label}
                    {link.children && <span className="text-xs">▾</span>}
                  </Link>
                  {link.children && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 bg-white border border-gold-200 shadow-lg rounded-md py-2 w-52 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gold-50 hover:text-maroon-500 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-maroon-500 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* User account */}
              {user ? (
                <div ref={userMenuRef} className="relative hidden sm:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gold-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-maroon-500 text-white text-xs font-bold flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate hidden lg:block">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown size={12} className="text-gray-400 hidden lg:block" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gold-100 rounded-xl shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gold-100">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/cart"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gold-50 hover:text-maroon-500 transition-colors"
                        >
                          <ShoppingBag size={15} /> My Cart
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gold-50 hover:text-maroon-500 transition-colors"
                        >
                          <Heart size={15} /> My Wishlist
                        </Link>
                        {user.isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gold-700 hover:bg-gold-50 transition-colors font-medium"
                          >
                            <LayoutDashboard size={15} /> Admin Dashboard
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-gold-100 py-1">
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false) }}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-300 text-sm font-medium text-maroon-500 hover:bg-gold-50 transition-colors"
                >
                  <User size={15} />
                  Login
                </Link>
              )}

              <Link
                href="/wishlist"
                className="p-2 text-gray-600 hover:text-maroon-500 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-maroon-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                className="p-2 text-gray-600 hover:text-maroon-500 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-maroon-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} links={visibleLinks} />
    </>
  )
}

'use client'

import { createContext, useContext, useEffect, useReducer } from 'react'
import { CartItem, Product } from '@/types'
import { useAuth } from './AuthContext'

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  addToCart: (product: Product) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.product.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { product: action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.product.id !== action.payload) }
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.payload.id) }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'LOAD_CART':
      return { ...state, items: action.payload }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  // Cart is stored per user; guests share 'aabharan-cart'
  const cartKey = user ? `aabharan-cart-${user.id}` : 'aabharan-cart'

  // Load the correct cart whenever auth resolves or the logged-in user changes
  useEffect(() => {
    if (authLoading) return
    const saved = localStorage.getItem(cartKey)
    try {
      dispatch({ type: 'LOAD_CART', payload: saved ? JSON.parse(saved) : [] })
    } catch {
      dispatch({ type: 'LOAD_CART', payload: [] })
    }
  }, [authLoading, user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Persist cart on every change (skip while auth is still resolving)
  useEffect(() => {
    if (authLoading) return
    localStorage.setItem(cartKey, JSON.stringify(state.items))
  }, [state.items, cartKey, authLoading])

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        addToCart: (product) => dispatch({ type: 'ADD_ITEM', payload: product }),
        removeFromCart: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
        updateQuantity: (id, quantity) =>
          dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

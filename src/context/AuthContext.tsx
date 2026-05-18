'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
}

interface StoredUser extends User { password: string }

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (email: string, name: string, password: string) => Promise<{ error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ── localStorage fallback constants ───────────────────────────────────────────
const USERS_KEY = 'aabharan-users'
const SESSION_KEY = 'aabharan-session'
const ADMIN_EMAIL = 'admin@aabharanbymallika.com'
const ADMIN_PASSWORD = 'Admin@2024!'

// ── localStorage helpers ──────────────────────────────────────────────────────
function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}
function saveUsers(u: StoredUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(u)) }
function seedAdmin() {
  const users = getUsers()
  if (!users.find((u) => u.email === ADMIN_EMAIL)) {
    saveUsers([...users, { id: 'admin', email: ADMIN_EMAIL, name: 'Admin', password: ADMIN_PASSWORD, isAdmin: true }])
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // ── localStorage mode ────────────────────────────────────────────────
      seedAdmin()
      const session = localStorage.getItem(SESSION_KEY)
      if (session) { try { setUser(JSON.parse(session)) } catch {} }
      setLoading(false)
      return
    }

    // ── Supabase mode ────────────────────────────────────────────────────────
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) await fetchProfile(session.user.id, session.user.email!)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email!)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (id: string, email: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('name, is_admin')
      .eq('id', id)
      .single()
    setUser({
      id,
      email,
      name: data?.name || email.split('@')[0],
      isAdmin: data?.is_admin ?? false,
    })
  }

  // ── login ─────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      const users = getUsers()
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
      if (!found) return { error: 'Invalid email or password.' }
      const { password: _pw1, ...u } = found
      setUser(u)
      localStorage.setItem(SESSION_KEY, JSON.stringify(u))
      return {}
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? { error: error.message } : {}
  }

  // ── register ──────────────────────────────────────────────────────────────
  const register = async (email: string, name: string, password: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      const users = getUsers()
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase()))
        return { error: 'An account with this email already exists.' }
      const newUser: StoredUser = { id: `user-${Date.now()}`, email, name, password, isAdmin: false }
      saveUsers([...users, newUser])
      const { password: _pw2, ...u } = newUser
      setUser(u)
      localStorage.setItem(SESSION_KEY, JSON.stringify(u))
      return {}
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    return error ? { error: error.message } : {}
  }

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut()
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

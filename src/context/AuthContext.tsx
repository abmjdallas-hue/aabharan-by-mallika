'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { withTimeout } from '@/lib/with-timeout'

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
    let active = true

    // Resolve a session into a user (including the admin flag) and only THEN clear
    // loading, so route guards never evaluate a half-loaded auth state. Without
    // this, a fresh sign-in redirects to /admin before isAdmin is known and the
    // guard bounces the user back to /login.
    const resolveSession = async (session: Session | null) => {
      try {
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email!)
        } else {
          setUser(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    withTimeout(supabase.auth.getSession())
      .then(({ data: { session } }) => resolveSession(session))
      .catch((err) => { console.error('[auth] getSession failed', err); if (active) setLoading(false) })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // On sign-in the profile/isAdmin isn't loaded yet — re-gate as loading so admin
      // guards wait instead of redirecting before isAdmin is resolved. (Token refreshes
      // keep the existing user, so don't flash loading for those.)
      if (event === 'SIGNED_IN' && session?.user) setLoading(true)
      resolveSession(session)
    })

    return () => { active = false; subscription.unsubscribe() }
  }, [])

  const fetchProfile = async (id: string, email: string) => {
    try {
      const { data } = await withTimeout(
        supabase.from('profiles').select('name, is_admin').eq('id', id).single(),
      )
      setUser({
        id,
        email,
        name: data?.name || email.split('@')[0],
        isAdmin: data?.is_admin ?? false,
      })
    } catch (err) {
      // Transient profile-fetch failure: keep any already-resolved user rather than
      // downgrading to non-admin (which would bounce an admin mid-session).
      console.error('[auth] fetchProfile failed', err)
      setUser((prev) => prev ?? { id, email, name: email.split('@')[0], isAdmin: false })
    }
  }

  // ── login ─────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      const users = getUsers()
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
      if (!found) return { error: 'Invalid email or password.' }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw1, ...u } = found
      setUser(u)
      localStorage.setItem(SESSION_KEY, JSON.stringify(u))
      return {}
    }
    try {
      const { error } = await withTimeout(supabase.auth.signInWithPassword({ email, password }))
      return error ? { error: error.message } : {}
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unable to sign in. Please try again.' }
    }
  }

  // ── register ──────────────────────────────────────────────────────────────
  const register = async (email: string, name: string, password: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      const users = getUsers()
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase()))
        return { error: 'An account with this email already exists.' }
      const newUser: StoredUser = { id: `user-${Date.now()}`, email, name, password, isAdmin: false }
      saveUsers([...users, newUser])
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw2, ...u } = newUser
      setUser(u)
      localStorage.setItem(SESSION_KEY, JSON.stringify(u))
      return {}
    }
    try {
      const { error } = await withTimeout(
        supabase.auth.signUp({ email, password, options: { data: { name } } }),
      )
      return error ? { error: error.message } : {}
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unable to create account. Please try again.' }
    }
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

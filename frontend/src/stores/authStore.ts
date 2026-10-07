import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import api from '../lib/api'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3002').replace(/\/+$/, '')
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  setAuth: (user: User | null, token: string | null) => void
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => void
}

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token') || localStorage.getItem('vaagai_token')
}

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('user')
  if (!stored) return null
  try {
    return JSON.parse(stored) as User
  } catch {
    return null
  }
}

const initialToken = getStoredToken()
const initialUser = getStoredUser()

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  loading: true,

  setAuth: (user, token) => {
    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('vaagai_token', token)
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('vaagai_token')
    }
    if (user) {
      try {
        localStorage.setItem('user', JSON.stringify(user))
      } catch {}
      if (user.id) localStorage.setItem('vaagai_user_id', user.id)
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('vaagai_user_id')
    }
    set({ user, token, isAuthenticated: Boolean(token) })
  },

  initialize: () => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        try {
          const { data } = await api.post('/api/auth/google/sync', {
            user: session.user,
          })
          if (data.user?.id) {
            localStorage.setItem('vaagai_user_id', data.user.id)
          }
          if (data.token) {
            localStorage.setItem('vaagai_token', data.token)
            localStorage.setItem('token', data.token)
          }
          if (data.user) {
            try {
              localStorage.setItem('user', JSON.stringify(data.user))
            } catch {}
          }
          set({
            user: data.user,
            token: data.token || null,
            isAuthenticated: Boolean(data.token),
            loading: false,
          })
        } catch {
          set({ loading: false })
        }
      } else {
        localStorage.removeItem('vaagai_token')
        localStorage.removeItem('vaagai_user_id')
        set({ user: null, token: null, isAuthenticated: false, loading: false })
      }
    })
  },

  signInWithGoogle: async () => {
    // Redirect to backend OAuth endpoint to use server-side Google flow
    window.location.href = `${API_URL}/api/auth/google`
  },

  signInWithEmail: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password })
      const data = response.data
      localStorage.setItem('vaagai_token', data.token)
      localStorage.setItem('token', data.token)
      if (data.user?.id) {
        localStorage.setItem('vaagai_user_id', data.user.id)
        try {
          localStorage.setItem('user', JSON.stringify(data.user))
        } catch {}
      } else {
        localStorage.setItem('vaagai_user_id', data.user?.email || email)
        try {
          localStorage.setItem('user', JSON.stringify({ email: data.user?.email || email }))
        } catch {}
      }
      set({ user: data.user, token: data.token, isAuthenticated: true })
    } catch (err) {
      throw err
    }
  },

  signUpWithEmail: async (name, email, password) => {
    const nameParts = name.split(' ')
    const { data } = await api.post<{ user: any; token: string }>('/api/auth/register', {
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' ') || undefined,
      email,
      password
    })
    localStorage.setItem('vaagai_token', data.token)
    localStorage.setItem('token', data.token)
    localStorage.setItem('vaagai_user_id', data.user?.id || email)
    try { localStorage.setItem('user', JSON.stringify(data.user || { email })) } catch {}
    set({ user: data.user, token: data.token, isAuthenticated: true })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('vaagai_token')
    localStorage.removeItem('token')
    localStorage.removeItem('vaagai_user_id')
    localStorage.removeItem('user')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
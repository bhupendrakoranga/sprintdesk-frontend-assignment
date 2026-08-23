import { create } from 'zustand'
import {
  getCurrentUser,
  login as loginRequest,
  refreshAccessToken,
} from '../services/authService'
import type { AuthUser, LoginCredentials } from '../types/global'

const REFRESH_TOKEN_KEY = 'sprintdesk.refreshToken'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthState {
  accessToken: string | null
  user: AuthUser | null
  status: AuthStatus
  initialize: () => Promise<void>
  login: (credentials: LoginCredentials) => Promise<void>
  refreshSession: () => Promise<string | null>
  logout: () => void
}

let initializationPromise: Promise<void> | null = null

const getStorage = () => (typeof window === 'undefined' ? null : window.localStorage)

const getRefreshToken = () => getStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null

const setRefreshToken = (refreshToken: string) => {
  getStorage()?.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

const removeRefreshToken = () => {
  getStorage()?.removeItem(REFRESH_TOKEN_KEY)
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  status: 'loading',

  initialize: () => {
    if (initializationPromise) {
      return initializationPromise
    }

    initializationPromise = (async () => {
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        set({ status: 'unauthenticated' })
        return
      }

      try {
        const tokens = await refreshAccessToken(refreshToken)
        const user = await getCurrentUser(tokens.accessToken)

        setRefreshToken(tokens.refreshToken)
        set({
          accessToken: tokens.accessToken,
          user,
          status: 'authenticated',
        })
      } catch {
        removeRefreshToken()
        set({
          accessToken: null,
          user: null,
          status: 'unauthenticated',
        })
      }
    })()

    return initializationPromise
  },

  login: async (credentials) => {
    try {
      const session = await loginRequest(credentials)

      setRefreshToken(session.refreshToken)
      set({
        accessToken: session.accessToken,
        user: {
          id: session.id,
          username: session.username,
          email: session.email,
          firstName: session.firstName,
          lastName: session.lastName,
          gender: session.gender,
          image: session.image,
        },
        status: 'authenticated',
      })
    } catch (error) {
      set({ status: 'unauthenticated' })
      throw error
    }
  },

  refreshSession: async () => {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      get().logout()
      return null
    }

    try {
      const tokens = await refreshAccessToken(refreshToken)

      setRefreshToken(tokens.refreshToken)
      set({ accessToken: tokens.accessToken, status: 'authenticated' })

      return tokens.accessToken
    } catch {
      get().logout()
      return null
    }
  },

  logout: () => {
    removeRefreshToken()
    set({
      accessToken: null,
      user: null,
      status: 'unauthenticated',
    })
  },
}))

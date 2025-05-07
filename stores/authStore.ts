import { api, handleApiResponse } from "@/services/api"
import type { LoginCredentials, User } from "@/types/auth"
import * as SecureStore from "expo-secure-store"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

// Custom storage for SecureStore
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name)
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name)
  },
}

interface AuthState {
  user: User | null
  loggedIn: boolean
  loading: boolean
  error: any
  initialized: boolean
  accessToken: string | null
  refreshToken: string | null

  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  checkAuthStatus: () => Promise<void>
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
  clearError: () => void
}

interface LoginResponse {
  tokens?: {
    access?: { token: string }
    refresh?: { token: string }
  }
  user?: User
}

interface SessionResponse {
  user?: User
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loggedIn: false,
      loading: false,
      error: null,
      initialized: false,
      accessToken: null,
      refreshToken: null,

      login: async (credentials: LoginCredentials) => {
        set({ loading: true, error: null })

        try {
          const rawResponse = await handleApiResponse(api.post("login", { json: { session: credentials } }).json())
          const response = rawResponse as LoginResponse

          if (response.tokens?.access?.token) {
            const accessToken = response.tokens.access.token
            const refreshToken = response.tokens.refresh?.token || ""

            if (credentials.remember_me) {
              await SecureStore.setItemAsync("token", accessToken)
              await SecureStore.setItemAsync("remember_token", refreshToken)
            }

            set({
              loading: false,
              loggedIn: true,
              user: response.user ?? null,
              accessToken,
              refreshToken,
            })
          } else {
            throw new Error("Invalid response from server")
          }
        } catch (error) {
          set({ loading: false, error })
          throw error
        }
      },

      logout: async () => {
        try {
          await handleApiResponse(api.delete("logout").json())
        } catch (error) {
          console.error("Logout error:", error)
        } finally {
          await SecureStore.deleteItemAsync("token")
          await SecureStore.deleteItemAsync("remember_token")

          set({
            loggedIn: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          })
        }
      },

      checkAuthStatus: async () => {
        const token = await SecureStore.getItemAsync("token")

        if (!token) {
          set({ loggedIn: false, user: null, initialized: true })
          return
        }

        set({ loading: true })

        try {
          const rawResponse = await handleApiResponse(api.get("sessions").json())
          const response = rawResponse as SessionResponse

          if (response.user) {
            set({
              loading: false,
              loggedIn: true,
              user: response.user,
              initialized: true,
            })
          } else {
            set({
              loading: false,
              loggedIn: false,
              user: null,
              initialized: true,
            })
          }
        } catch {
          set({
            loading: false,
            loggedIn: false,
            user: null,
            initialized: true,
          })
        }
      },

      setTokens: ({ accessToken, refreshToken }) => {
        set({ accessToken, refreshToken })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        user: state.user,
        loggedIn: state.loggedIn,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
)

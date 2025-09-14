import { decodeToken } from '@/shared/lib/jwt'
import ROUTES from '@/shared/lib/routes'
import { useSocketStore } from '@/shared/stores/useSocketStore'
import type { LoginResponse } from '@/shared/validations/AuthSchema'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface AuthState {
  isAuth: boolean
  userId: string | null
  token: LoginResponse | null
  isLoading: boolean
  roles: string[] | null
  username: string | null
  login: (token: LoginResponse) => Promise<void>
  logout: () => void
  setLoading: (loading: boolean) => void
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist<AuthState>(
      (set) => ({
        isAuth: false,
        userId: null,
        token: null,
        isLoading: false,
        roles: null,
        username: null,
        login: async (token: LoginResponse) => {
          const decodedToken = decodeToken(token.accessToken)
          if (!decodedToken) {
            window.location.href = ROUTES.LOGIN.url
            return
          }
          set({
            isAuth: true,
            token: token,
            roles: decodedToken.roles,
            userId: decodedToken.sub,
            username: decodedToken.username
          })

          // Kết nối socket sau khi login
          const { connect } = useSocketStore.getState()
          connect(token.accessToken)
        },
        logout: () => {
          const { disconnect } = useSocketStore.getState()
          disconnect()
          set({ isAuth: false, token: null, roles: null, userId: null, username: null })
        },
        setLoading: (loading: boolean) => set({ isLoading: loading })
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage)
      }
    )
  )
)

export default useAuthStore

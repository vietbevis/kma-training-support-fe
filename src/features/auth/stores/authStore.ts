import { decodeToken } from '@/shared/lib/jwt'
import ROUTES from '@/shared/lib/routes'
import type { LoginResponse } from '@/shared/validations/AuthSchema'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface AuthState {
  isAuth: boolean
  userId: string | null
  token: LoginResponse | null
  roles: string[] | null
  username: string | null
  login: (token: LoginResponse) => Promise<void>
  logout: () => void
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist<AuthState>(
      (set) => ({
        isAuth: false,
        userId: null,
        token: null,
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
        },
        logout: () => set({ isAuth: false, token: null, roles: null, userId: null, username: null })
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage)
      }
    )
  )
)

export default useAuthStore

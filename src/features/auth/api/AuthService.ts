import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import ROUTES from '@/shared/lib/routes'
import type {
  LoginBodyType,
  LoginResponse,
  RefreshTokenBodyType,
  RefreshTokenResponse
} from '@/shared/validations/AuthSchema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import useAuthStore from '../stores/authStore'

export const useLoginMutation = () => {
  const login = useAuthStore((state) => state.login)
  return useMutation({
    mutationFn: (body: LoginBodyType) => api.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, body),
    onSuccess: (data) => {
      login(data.data)
      toast.success('Đăng nhập thành công.')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Đăng nhập thất bại.')
    }
  })
}

export const useLogoutMutation = () => {
  const logout = useAuthStore((state) => state.logout)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (refreshToken: string) => api.post(API_ROUTES.AUTH.LOGOUT, { refreshToken }),
    onSuccess: () => {
      logout()
      queryClient.clear()
      toast.success('Đăng xuất thành công.')
    },
    onError: (error: any) => {
      logout()
      queryClient.clear()
      toast.error(error.message || 'Đăng xuất thất bại.')
    }
  })
}

export const useRefreshTokenMutation = () => {
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (body: RefreshTokenBodyType) => api.post<RefreshTokenResponse>(API_ROUTES.AUTH.REFRESH_TOKEN, body),
    onSuccess: (data) => {
      login(data.data)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Phiên đăng nhập hết hạn.')
      logout()
      navigate(ROUTES.LOGIN.url)
    }
  })
}

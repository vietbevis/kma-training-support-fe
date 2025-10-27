import { useAuthStore } from '@/features/auth'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import envConfig from '../config/envConfig'
import type { RefreshTokenResponse } from '../validations/AuthSchema'
import API_ROUTES from './api-routes'
import ROUTES from './routes'

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const api = axios.create({
  baseURL: envConfig.VITE_ENV === 'development' ? '/api' : envConfig.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

let isRefreshing = false
let refreshTokenPromise: Promise<string> | null = null

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().token?.accessToken

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig

    // Nếu refresh token request bị lỗi, logout luôn
    if (originalRequest?.url?.includes(API_ROUTES.AUTH.REFRESH_TOKEN)) {
      isRefreshing = false
      refreshTokenPromise = null
      useAuthStore.getState().logout()
      window.location.href = ROUTES.LOGIN.url
      return Promise.reject(error)
    }

    // Xử lý 401 (trừ login endpoint)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest?.url?.includes(API_ROUTES.AUTH.LOGIN)
    ) {
      originalRequest._retry = true

      // Nếu đang refresh, chờ promise hiện tại
      if (isRefreshing && refreshTokenPromise) {
        try {
          const newToken = await refreshTokenPromise
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        } catch (refreshError) {
          return Promise.reject(refreshError)
        }
      }

      // Bắt đầu refresh token process
      isRefreshing = true

      refreshTokenPromise = (async () => {
        try {
          const refreshToken = useAuthStore.getState().token?.refreshToken

          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          const response = await api.post<RefreshTokenResponse>(API_ROUTES.AUTH.REFRESH_TOKEN, { refreshToken })

          const newToken = response.data.accessToken
          useAuthStore.getState().login(response.data)

          return newToken
        } catch (refreshError) {
          useAuthStore.getState().logout()
          window.location.href = ROUTES.LOGIN.url
          throw refreshError
        } finally {
          isRefreshing = false
          refreshTokenPromise = null
        }
      })()

      try {
        const newToken = await refreshTokenPromise
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error.response?.data)
  }
)

export default api

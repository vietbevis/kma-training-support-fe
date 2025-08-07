import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { decodeToken } from '@/shared/lib/jwt'
import ROUTES from '@/shared/lib/routes'
import type { RefreshTokenResponse } from '@/shared/validations/AuthSchema'
import { redirect, type LoaderFunctionArgs } from 'react-router'
import useAuthStore from '../stores/authStore'

export const authLoader = async ({ request }: LoaderFunctionArgs) => {
  console.log('props >>> authLoader', request.url)
  const { token, logout, login, isAuth: isAuthenticated } = useAuthStore.getState()

  // Nếu nhân viên chưa đăng nhập, clear auth store và chuyển hướng đến trang login
  if (!isAuthenticated) {
    logout()
    return redirect(ROUTES.LOGIN.url)
  }

  // Kiểm tra tính hợp lệ của access token
  try {
    const accessToken = token?.accessToken
    const refreshToken = token?.refreshToken

    // Nếu không có access token, clear auth store và chuyển hướng đến trang login
    if (!accessToken) {
      logout()
      return redirect(ROUTES.LOGIN.url)
    }

    // Giải mã access token và kiểm tra tính hợp lệ
    const decodedAccess = decodeToken(accessToken)
    if (!decodedAccess) {
      logout()
      return redirect(ROUTES.LOGIN.url)
    }

    // Kiểm tra xem access token có hết hạn không
    const isAccessTokenExpired = decodedAccess.exp * 1000 < Date.now()

    // Nếu access token vẫn hợp lệ, không làm gì cả
    if (!isAccessTokenExpired) {
      return
    }

    // Nếu không có refresh token, clear auth store và chuyển hướng đến trang login
    if (!refreshToken) {
      logout()
      return redirect(ROUTES.LOGIN.url)
    }

    // Kiểm tra tính hợp lệ của refresh token
    const decodedRefresh = decodeToken(refreshToken)
    if (!decodedRefresh || decodedRefresh.exp * 1000 < Date.now()) {
      logout()
      return redirect(ROUTES.LOGIN.url)
    }

    // Thử làm mới token bằng refresh token
    try {
      const response = await api.post<RefreshTokenResponse>(API_ROUTES.AUTH.REFRESH_TOKEN, {
        refreshToken
      })
      login(response.data)
      return
    } catch {
      logout()
      return redirect(ROUTES.LOGIN.url)
    }
  } catch {
    logout()
    return redirect(ROUTES.LOGIN.url)
  }
}

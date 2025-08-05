import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { decodeToken } from '@/shared/lib/jwt'
import ROUTES from '@/shared/lib/routes'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useRefreshTokenMutation } from '../api/AuthService'
import useAuthStore from '../stores/authStore'

const AuthGuard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { token, login, logout } = useAuthStore()
  const location = useLocation()
  const { mutateAsync: refreshTokenMutation } = useRefreshTokenMutation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = token?.accessToken
        const refreshToken = token?.refreshToken

        // Không có access token - nhân viên chưa đăng nhập
        if (!accessToken) {
          logout()
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Giải mã access token
        const decodedAccess = decodeToken(accessToken)
        if (!decodedAccess) {
          logout()
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Kiểm tra xem access token có hợp lệ không
        const isAccessTokenExpired = decodedAccess.exp * 1000 < Date.now()

        if (!isAccessTokenExpired) {
          // Access token vẫn hợp lệ
          setIsAuthenticated(true)
          setIsLoading(false)
          return
        }

        // Access token hết hạn, thử làm mới
        if (!refreshToken) {
          logout()
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Kiểm tra tính hợp lệ của refresh token
        const decodedRefresh = decodeToken(refreshToken)
        if (!decodedRefresh || decodedRefresh.exp * 1000 < Date.now()) {
          logout()
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Thử làm mới token
        try {
          await refreshTokenMutation({ refreshToken })
          setIsAuthenticated(true)
          setIsLoading(false)
        } catch (error) {
          logout()
          setIsAuthenticated(false)
          setIsLoading(false)
        }
      } catch (error) {
        logout()
        setIsAuthenticated(false)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [token, login, logout, refreshTokenMutation])

  // Hiển thị spinner khi kiểm tra xem nhân viên có đăng nhập không
  if (isLoading) {
    return <LoadingSpinner isLoading={isLoading} />
  }

  // Chuyển hướng đến trang đăng nhập nếu nhân viên chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN.url} state={{ from: location.pathname }} replace />
  }

  // nhân viên đã đăng nhập, hiển thị children
  return <Outlet />
}

export default AuthGuard

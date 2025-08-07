import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { decodeToken } from '@/shared/lib/jwt'
import ROUTES from '@/shared/lib/routes'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useRefreshTokenMutation } from '../api/AuthService'
import useAuthStore from '../stores/authStore'

let countRefreshingToken = 0

const AuthGuard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { token, logout, isAuth: isAuthenticated } = useAuthStore()
  const location = useLocation()
  const { mutateAsync: refreshTokenMutation, isPending: isRefreshingToken } = useRefreshTokenMutation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = token?.accessToken
        const refreshToken = token?.refreshToken

        // Không có access token - nhân viên chưa đăng nhập
        if (!accessToken) {
          logout()
          setIsLoading(false)
          return
        }

        // Giải mã access token
        const decodedAccess = decodeToken(accessToken)
        if (!decodedAccess) {
          logout()
          setIsLoading(false)
          return
        }

        // Kiểm tra xem access token có hợp lệ không
        const isAccessTokenExpired = decodedAccess.exp * 1000 < Date.now()

        if (!isAccessTokenExpired) {
          // Access token vẫn hợp lệ
          setIsLoading(false)
          return
        }

        // Access token hết hạn, thử làm mới
        if (!refreshToken) {
          logout()
          setIsLoading(false)
          return
        }

        // Kiểm tra tính hợp lệ của refresh token
        const decodedRefresh = decodeToken(refreshToken)
        if (!decodedRefresh || decodedRefresh.exp * 1000 < Date.now()) {
          logout()
          setIsLoading(false)
          return
        }

        // Thử làm mới token
        try {
          if (isRefreshingToken) return
          await refreshTokenMutation({ refreshToken })

          console.log('🚀 ~ checkAuth ~ countRefreshingToken:', countRefreshingToken)
          countRefreshingToken++

          setIsLoading(false)
        } catch {
          logout()
          setIsLoading(false)
        }
      } catch {
        logout()
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [logout, refreshTokenMutation, token?.accessToken, token?.refreshToken, isRefreshingToken])

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

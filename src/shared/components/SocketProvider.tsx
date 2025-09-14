// components/SocketProvider.tsx
import { useAuthStore } from '@/features/auth'
import React, { type ReactNode, useEffect } from 'react'
import { useSocket } from '../hooks/useSocket'

interface SocketProviderProps {
  children: ReactNode
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { error, isConnecting, isConnected } = useSocket()
  const { isAuth } = useAuthStore()

  // Log socket status cho debugging
  useEffect(() => {
    if (isAuth) {
      if (isConnecting) {
        console.log('Socket đang kết nối...')
      } else if (isConnected) {
        console.log('Socket đã kết nối thành công')
      } else if (error) {
        console.error('Lỗi socket:', error)
      }
    }
  }, [isAuth, isConnecting, isConnected, error])

  return <>{children}</>
}

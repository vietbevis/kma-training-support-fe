// hooks/useSocket.ts
import { useAuthStore } from '@/features/auth'
import { useCallback, useEffect } from 'react'
import { useSocketStore } from '../stores/useSocketStore'

export const useSocket = () => {
  const { socket, isConnected, isConnecting, error, connect, disconnect } = useSocketStore()

  // Giả sử auth store có token và isAuthenticated
  const { token, isAuth, isLoading } = useAuthStore()

  // Kết nối socket khi user đăng nhập
  useEffect(() => {
    if (isAuth && token && !socket && !isConnecting && !isLoading) {
      connect(token.accessToken)
    }
  }, [isAuth, token, socket, isConnecting, connect, isLoading])

  // Ngắt kết nối khi user đăng xuất
  useEffect(() => {
    if (!isAuth && socket && !isLoading) {
      disconnect()
    }
  }, [isAuth, socket, disconnect, isLoading])

  // Emit event với error handling
  const emit = useCallback(
    (event: string, data?: any) => {
      if (socket && isConnected) {
        socket.emit(event, data)
        return true
      }
      console.warn('Socket not connected, cannot emit:', event)
      return false
    },
    [socket, isConnected]
  )

  // Listen to events
  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (socket) {
        socket.on(event, callback)

        // Return cleanup function
        return () => {
          socket.off(event, callback)
        }
      }
    },
    [socket]
  )

  // Listen once
  const once = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (socket) {
        socket.once(event, callback)
      }
    },
    [socket]
  )

  // Remove listener
  const off = useCallback(
    (event: string, callback?: (...args: any[]) => void) => {
      if (socket) {
        socket.off(event, callback)
      }
    },
    [socket]
  )

  return {
    socket,
    isConnected,
    isConnecting,
    error,
    emit,
    on,
    once,
    off,
    connect: () => token && connect(token.accessToken),
    disconnect
  }
}

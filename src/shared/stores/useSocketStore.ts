// stores/socketStore.ts
import { io, type Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { create } from 'zustand'
import envConfig from '../config/envConfig'

interface SocketState {
  socket: Socket | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  connect: (token: string) => void
  disconnect: () => void
  setConnected: (connected: boolean) => void
  setError: (error: string | null) => void
  setConnecting: (connecting: boolean) => void
}

export const useSocketStore = create<SocketState>()((set, get) => ({
  socket: null,
  isConnected: false,
  isConnecting: false,
  error: null,

  connect: (token: string) => {
    const { socket, isConnected } = get()

    // Nếu đã có kết nối, không tạo mới
    if (socket && isConnected) {
      return
    }

    // Nếu đang kết nối, không tạo mới
    if (get().isConnecting) {
      return
    }

    set({ isConnecting: true, error: null })

    try {
      const newSocket = io(`${envConfig.VITE_SOCKET_URL}/backup`, {
        auth: { token },
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })

      // Event listeners
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id)
        set({
          isConnected: true,
          isConnecting: false,
          error: null,
          socket: newSocket
        })
      })

      newSocket.on('disconnect', (reason: any) => {
        console.log('Socket disconnected:', reason)
        set({
          isConnected: false,
          isConnecting: false,
          error: reason === 'io server disconnect' ? 'Server disconnected' : null
        })
      })

      newSocket.on('connect_error', (error: any) => {
        console.error('Socket connection error:', error)
        toast.error('Lỗi kết nối socket!', {
          description: 'Vui lòng kiểm tra lại kết nối internet và thử đăng nhập lại.'
        })
        set({
          isConnected: false,
          isConnecting: false,
          error: 'Lỗi kết nối socket!'
        })
      })

      newSocket.on('auth_error', (error: any) => {
        console.error('Socket auth error:', error)
        toast.error('Lỗi xác thực khi kết nối socket!', {
          description: 'Vui lòng kiểm tra lại thông tin đăng nhập và thử đăng nhập lại.'
        })
        set({
          isConnected: false,
          isConnecting: false,
          error: 'Lỗi xác thực khi kết nối socket!'
        })
        newSocket.disconnect()
      })

      set({ socket: newSocket })
    } catch (error: any) {
      console.error('Failed to create socket:', error)
      toast.error('Lỗi kết nối socket!', {
        description: 'Vui lòng kiểm tra lại kết nối internet và thử đăng nhập lại.'
      })
      set({
        isConnecting: false,
        error: 'Lỗi kết nối socket!'
      })
    }
  },

  disconnect: () => {
    const { socket } = get()

    if (socket) {
      socket.disconnect()
      set({
        socket: null,
        isConnected: false,
        isConnecting: false,
        error: null
      })
    }
  },

  setConnected: (connected: boolean) => set({ isConnected: connected }),
  setError: (error: string | null) => set({ error }),
  setConnecting: (connecting: boolean) => set({ isConnecting: connecting })
}))

import { create } from 'zustand'

interface GlobalLoadingState {
  loading?: boolean
  message?: string
  setLoading: (loading: boolean, message?: string) => void
}

export const useGlobalLoadingStore = create<GlobalLoadingState>((set) => ({
  loading: false,
  message: '',
  setLoading: (loading: boolean, message?: string) => set({ loading, message })
}))

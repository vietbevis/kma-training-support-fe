import { useGlobalLoadingStore } from '../stores/useGlobalLoading'
import LoadingSpinner from './LoadingSpinner'

export default function GlobalLoadingPrivider({ children }: { children: React.ReactNode }) {
  const { loading, message } = useGlobalLoadingStore()

  if (loading) {
    return (
      <div className='fixed inset-0 z-50 flex gap-20 flex-col justify-center items-center bg-background/80 backdrop-blur-sm'>
        <LoadingSpinner isLoading={loading} />
        {message && <p className='text-sm text-muted-foreground'>{message}</p>}
      </div>
    )
  }

  return <>{children}</>
}

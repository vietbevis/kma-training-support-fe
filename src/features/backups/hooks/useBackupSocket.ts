import { useSocket } from '@/shared/hooks/useSocket'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import BackupToast from '../components/BackupToast'

/**
 * Hook to listen to backup WebSocket events and update UI accordingly
 */
export const useBackupSocket = () => {
  const { on, isConnected } = useSocket()
  const queryClient = useQueryClient()

  // Event keys from server
  const EVENT_KEYS = {
    BACKUP_STATUS: 'backup_status',
    BACKUP_COMPLETE: 'backup_complete',
    BACKUP_ERROR: 'backup_error'
  }

  useEffect(() => {
    if (!isConnected) return

    // Handler for backup status updates
    const handleBackupStatus = (payload: any) => {
      console.log('Received backup status update:', payload)

      // Invalidate the cache to refresh backup data
      queryClient.invalidateQueries({
        queryKey: ['backups']
      })

      // Optionally show a toast for important status changes
      const { status } = payload.data || {}

      if (status === 'in_progress') {
        toast.info('Đang tiến hành sao lưu...', {
          description: `ID: ${payload.data?.backupId}`
        })
      }
    }

    // Handler for backup completion
    const handleBackupComplete = (payload: any) => {
      console.log('Backup completed:', payload)

      // Invalidate the cache to refresh backup data
      queryClient.invalidateQueries({
        queryKey: ['backups']
      })
      queryClient.invalidateQueries({
        queryKey: ['backup-statistics']
      })
      // Show success notification
      toast.success('Sao lưu hoàn tất', {
        description: BackupToast(payload.data?.backupId || '')
      })
    }

    // Handler for backup errors
    const handleBackupError = (payload: any) => {
      console.error('Backup error:', payload)

      // Invalidate the cache to refresh backup data
      queryClient.invalidateQueries({
        queryKey: ['backups']
      })
      queryClient.invalidateQueries({
        queryKey: ['backup-statistics']
      })
      // Show error notification
      toast.error('Lỗi sao lưu', {
        description: payload.message || 'Đã xảy ra lỗi khi sao lưu'
      })
    }

    // Subscribe to events
    const unsubscribeStatus = on(EVENT_KEYS.BACKUP_STATUS, handleBackupStatus)
    const unsubscribeComplete = on(EVENT_KEYS.BACKUP_COMPLETE, handleBackupComplete)
    const unsubscribeError = on(EVENT_KEYS.BACKUP_ERROR, handleBackupError)

    // Cleanup on unmount
    return () => {
      unsubscribeStatus?.()
      unsubscribeComplete?.()
      unsubscribeError?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, on, queryClient])
}

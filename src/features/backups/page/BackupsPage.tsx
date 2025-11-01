import { PaginationComponent } from '@/shared/components/Pagination'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type { CreateBackupDto, QueryBackupDto, RestoreFromUploadDto } from '@/shared/validations/BackupSchema'
import { Plus, RotateCcw, Trash, Upload } from 'lucide-react'
import type { BackupResponseType } from '../api/BackupService'
import {
  useCleanupBackupsMutation,
  useCreateBackupMutation,
  useDeleteBackupMutation,
  useGetBackupStatisticsQuery,
  useGetBackupsQuery,
  useRebuildMetadataMutation,
  useRestoreBackupMutation,
  useRestoreFromUploadMutation
} from '../api/BackupService'
import { BackupFilters, BackupStatistics, BackupTable, RestoreFromUploadForm } from '../components'
import { BackupForm } from '../components/BackupForm'
import { useBackupSocket } from '../hooks'

const BackupsPageComponent = () => {
  // Initialize socket listeners for backup events
  useBackupSocket()

  const { filters, setFilters, resetFilters } = useSearchParamsManager({
    page: '',
    limit: '10',
    search: '',
    status: '',
    type: ''
  })

  const { data: backupsData, isLoading: isLoadingBackups } = useGetBackupsQuery(filters as unknown as QueryBackupDto)

  const { data: statisticsData, isLoading: isLoadingStatistics } = useGetBackupStatisticsQuery()

  const createBackupMutation = useCreateBackupMutation()
  const deleteBackupMutation = useDeleteBackupMutation()
  const restoreBackupMutation = useRestoreBackupMutation()
  const restoreFromUploadMutation = useRestoreFromUploadMutation()
  const cleanupBackupsMutation = useCleanupBackupsMutation()
  const rebuildMetadataMutation = useRebuildMetadataMutation()

  const dialogStore = useDialogStore()

  const handleCreateBackup = () => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Tạo backup',
      description: 'Tạo backup mới vào hệ thống',
      content: <BackupForm onSubmit={handleCreateBackupSubmit} isLoading={createBackupMutation.isPending} />
    })
  }

  const handleCreateBackupSubmit = async (data: CreateBackupDto) => {
    try {
      await createBackupMutation.mutateAsync(data)
      dialogStore.closeDialog()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteBackup = (id: string) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xóa backup',
      description: 'Bạn có chắc chắn muốn xóa backup này không? Hành động này không thể hoàn tác.',
      loading: deleteBackupMutation.isPending,
      onConfirm: async () => {
        dialogStore.setLoading?.(true)
        try {
          await deleteBackupMutation.mutateAsync(id)
          dialogStore.closeDialog()
        } catch (error) {
          console.error(error)
        } finally {
          dialogStore.setLoading?.(false)
        }
      }
    })
  }

  const handleRestoreBackup = (backup: BackupResponseType) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Khôi phục backup',
      description: 'Khôi phục backup từ file',
      loading: restoreBackupMutation.isPending,
      onConfirm: async () => {
        dialogStore.setLoading?.(true)
        try {
          await restoreBackupMutation.mutateAsync(backup.id)
          dialogStore.closeDialog()
        } catch (error) {
          console.error(error)
        } finally {
          dialogStore.setLoading?.(false)
        }
      }
    })
  }

  const handleRestoreFromUpload = () => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Khôi phục từ file',
      description: 'Khôi phục từ file backup',
      content: (
        <RestoreFromUploadForm
          onSubmit={handleRestoreFromUploadSubmit}
          isLoading={restoreFromUploadMutation.isPending}
        />
      )
    })
  }

  const handleRestoreFromUploadSubmit = async (formData: FormData) => {
    const file = formData.get('backupFile') as File

    const data: RestoreFromUploadDto = {
      backupFile: file as File
    }

    dialogStore.setLoading?.(true)
    try {
      await restoreFromUploadMutation.mutateAsync(data)
      dialogStore.closeDialog()
    } catch (error) {
      console.error(error)
    } finally {
      dialogStore.setLoading?.(false)
    }
  }

  const handleCleanupBackups = () => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Dọn dẹp backups',
      description: 'Hệ thống sẽ xóa các backup bị lỗi hoặc không hoàn chỉnh. Bạn có chắc chắn muốn tiếp tục?',
      loading: cleanupBackupsMutation.isPending,
      onConfirm: async () => {
        dialogStore.setLoading?.(true)
        try {
          await cleanupBackupsMutation.mutateAsync()
          dialogStore.closeDialog()
        } catch (error) {
          console.error(error)
        } finally {
          dialogStore.setLoading?.(false)
        }
      }
    })
  }

  const handleRebuildMetadata = () => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Tái tạo metadata',
      description: 'Hệ thống sẽ tái tạo metadata từ các file backup hiện có. Bạn có chắc chắn muốn tiếp tục?',
      loading: rebuildMetadataMutation.isPending,
      onConfirm: async () => {
        dialogStore.setLoading?.(true)
        try {
          await rebuildMetadataMutation.mutateAsync()
          dialogStore.closeDialog()
        } catch (error) {
          console.error(error)
        } finally {
          dialogStore.setLoading?.(false)
        }
      }
    })
  }

  return (
    <>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold'>Quản lý backup</h1>
          <p className='text-muted-foreground'>Quản lý danh sách backup trong hệ thống</p>
        </div>
        <div className='flex space-x-2 justify-end'>
          <PermissionButton
            variant='outline'
            size='sm'
            requiredPermission={PERMISSIONS.BACKUPS.RESTORE_FROM_UPLOAD}
            onClick={handleRestoreFromUpload}
          >
            <Upload className='h-4 w-4 mr-2' />
            Khôi phục từ file
          </PermissionButton>
          <PermissionButton
            variant='outline'
            size='sm'
            requiredPermission={PERMISSIONS.BACKUPS.CLEANUP}
            onClick={handleCleanupBackups}
          >
            <Trash className='h-4 w-4 mr-2' />
            Dọn dẹp
          </PermissionButton>
          <PermissionButton
            variant='outline'
            size='sm'
            requiredPermission={PERMISSIONS.BACKUPS.REBUILD_METADATA}
            onClick={handleRebuildMetadata}
          >
            <RotateCcw className='h-4 w-4 mr-2' />
            Tái tạo metadata
          </PermissionButton>
          <PermissionButton size='sm' requiredPermission={PERMISSIONS.BACKUPS.CREATE} onClick={handleCreateBackup}>
            <Plus className='h-4 w-4 mr-2' />
            Tạo backup
          </PermissionButton>
        </div>
        <BackupStatistics data={statisticsData?.data} isLoading={isLoadingStatistics} />
        <BackupFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />
        <div className='mt-6'>
          <BackupTable
            data={backupsData?.data.data || []}
            isLoading={isLoadingBackups}
            onRestore={handleRestoreBackup}
            onDelete={handleDeleteBackup}
          />
        </div>
        {backupsData && backupsData.data.meta && (
          <PaginationComponent meta={backupsData.data.meta} setFilter={setFilters} />
        )}
      </div>
    </>
  )
}

export const BackupsPage = withPermissionGuard(BackupsPageComponent, PERMISSIONS.BACKUPS.LIST)

import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import { useGlobalLoadingStore } from '@/shared/stores/useGlobalLoading'
import type {
  BackupStatisticsResponseDto,
  CreateBackupDto,
  ForceCleanupResponseDto,
  QueryBackupDto,
  RestoreFromUploadDto
} from '@/shared/validations/BackupSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface BackupResponseType {
  id: string
  name: string
  description?: string
  fileSize: number
  filePath: string
  status: string
  type: string
  createdAt: string
  completedAt?: string
  metadata?: Record<string, any>
}

export interface BackupsResponseType {
  data: BackupResponseType[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Get backups list
export const useGetBackupsQuery = (params: QueryBackupDto) => {
  return useQuery({
    queryKey: ['backups', normalizeObject(params)],
    queryFn: () =>
      api.get<BackupsResponseType>(API_ROUTES.BACKUPS.ROOT, {
        params: normalizeObject(params)
      })
  })
}

// Get a backup by ID
export const useGetBackupByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['backups', id],
    queryFn: () => api.get<BackupResponseType>(`${API_ROUTES.BACKUPS.ROOT}/${id}`),
    enabled: !!id
  })
}

// Create backup
export const useCreateBackupMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBackupDto) => api.post<BackupResponseType>(API_ROUTES.BACKUPS.ROOT, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] })
      toast.success('Tạo backup thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Tạo backup thất bại')
    }
  })
}

// Delete backup
export const useDeleteBackupMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<{ message: string }>(`${API_ROUTES.BACKUPS.ROOT}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] })
      toast.success('Xóa backup thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa backup thất bại')
    }
  })
}

// Restore backup
export const useRestoreBackupMutation = () => {
  const queryClient = useQueryClient()
  const { setLoading } = useGlobalLoadingStore()
  return useMutation({
    mutationFn: (id: string) => {
      setLoading(true, 'Đang khôi phục backup... Vui lòng không đóng trang!')
      return api.post<{ message: string }>(API_ROUTES.BACKUPS.RESTORE(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
      setLoading(false, '')
      toast.success('Khôi phục backup thành công')
    },
    onError: (error: any) => {
      setLoading(false, '')
      toast.error(error.message || 'Khôi phục backup thất bại')
    }
  })
}

// Restore from upload
export const useRestoreFromUploadMutation = () => {
  const queryClient = useQueryClient()
  const { setLoading } = useGlobalLoadingStore()
  return useMutation({
    mutationFn: (data: RestoreFromUploadDto) => {
      setLoading(true, 'Đang khôi phục backup từ file... Vui lòng không đóng trang!')
      const formData = new FormData()
      formData.append('backupFile', data.backupFile)
      return api.post<{ message: string }>(API_ROUTES.BACKUPS.RESTORE_FROM_UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
      setLoading(false, '')
      toast.success('Khôi phục từ file backup thành công')
    },
    onError: (error: any) => {
      setLoading(false, '')
      toast.error(error.message || 'Khôi phục từ file backup thất bại')
    }
  })
}

// Get backup statistics
export const useGetBackupStatisticsQuery = () => {
  return useQuery({
    queryKey: ['backup-statistics'],
    queryFn: () => api.get<BackupStatisticsResponseDto>(API_ROUTES.BACKUPS.STATISTICS)
  })
}

// Cleanup backups
export const useCleanupBackupsMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.post<ForceCleanupResponseDto>(API_ROUTES.BACKUPS.CLEANUP),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] })
      queryClient.invalidateQueries({ queryKey: ['backup-statistics'] })
      toast.success('Dọn dẹp backup thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Dọn dẹp backup thất bại')
    }
  })
}

// Rebuild metadata
export const useRebuildMetadataMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.post<{ message: string }>(API_ROUTES.BACKUPS.REBUILD_METADATA),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] })
      queryClient.invalidateQueries({ queryKey: ['backup-statistics'] })
      toast.success('Tái tạo metadata thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Tái tạo metadata thất bại')
    }
  })
}

// Download backup
export const getDownloadBackupUrl = async (id: string) => {
  const response = await api.get(`${API_ROUTES.BACKUPS.DOWNLOAD(id)}`, {
    responseType: 'blob'
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url

  // lấy filename từ header nếu có
  const disposition = response.headers['content-disposition']
  let filename = 'backup.zip'
  if (disposition) {
    const match = disposition.match(/filename="?([^"]+)"?/)
    if (match) {
      filename = decodeURIComponent(match[1])
    }
  }

  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

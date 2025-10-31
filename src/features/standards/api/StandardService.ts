import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type { UpdateStandardDto } from '@/shared/validations/StandardSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetStandardsQuery = ({
  page = '1',
  limit = '10',
  courseId = '',
  academicYearId = '',
  semester = '',
  startDate = '',
  endDate = '',
  className = ''
}: {
  page?: string
  limit?: string
  courseId?: string
  academicYearId?: string
  semester?: string
  startDate?: string
  endDate?: string
  className?: string
}) => {
  return useQuery({
    queryKey: [
      'standards',
      normalizeObject({ page, limit, courseId, academicYearId, semester, startDate, endDate, className })
    ],
    queryFn: () =>
      api.get(API_ROUTES.STANDARDS, {
        params: normalizeObject({ page, limit, courseId, academicYearId, semester, startDate, endDate, className })
      })
  })
}

export const useGetStandardByIdQuery = (id: string, options = {}) => {
  return useQuery({
    queryKey: ['standard', id],
    queryFn: () => api.get(`${API_ROUTES.STANDARDS}/${id}`),
    ...options
  })
}

export const useUpdateStandardMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStandardDto }) =>
      api.patch(`${API_ROUTES.STANDARDS}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standards'] })
      toast.success('Cập nhật quy chuẩn thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật quy chuẩn thất bại')
    }
  })
}

export const useDeleteStandardMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`${API_ROUTES.STANDARDS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standards'] })
      toast.success('Xóa quy chuẩn thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa quy chuẩn thất bại')
    }
  })
}

export const useUploadStandardWordMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post(`${API_ROUTES.STANDARDS}/upload-word`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standards'] })
      toast.success('Tải lên quy chuẩn từ Word thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Tải lên quy chuẩn từ Word thất bại')
    }
  })
}

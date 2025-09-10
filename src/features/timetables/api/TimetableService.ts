import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type {
  CreateTimetableDto,
  TimetableConflictCheckDto,
  UpdateTimetableDto
} from '@/shared/validations/TimetableSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetTimetablesQuery = ({
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
      'timetables',
      normalizeObject({ page, limit, courseId, academicYearId, semester, startDate, endDate, className })
    ],
    queryFn: () =>
      api.get(API_ROUTES.TIMETABLES, {
        params: normalizeObject({ page, limit, courseId, academicYearId, semester, startDate, endDate, className })
      })
  })
}

export const useGetTimetableByIdQuery = (id: string, options = {}) => {
  return useQuery({
    queryKey: ['timetable', id],
    queryFn: () => api.get(`${API_ROUTES.TIMETABLES}/${id}`),
    ...options
  })
}

export const useCreateTimetableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTimetableDto) => api.post(API_ROUTES.TIMETABLES, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] })
      toast.success('Thêm thời khóa biểu thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Thêm thời khóa biểu thất bại')
    }
  })
}

export const useUpdateTimetableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTimetableDto }) =>
      api.patch(`${API_ROUTES.TIMETABLES}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] })
      toast.success('Cập nhật thời khóa biểu thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật thời khóa biểu thất bại')
    }
  })
}

export const useDeleteTimetableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`${API_ROUTES.TIMETABLES}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] })
      toast.success('Xóa thời khóa biểu thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa thời khóa biểu thất bại')
    }
  })
}

export const useUploadTimetableExcelMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post(`${API_ROUTES.TIMETABLES}/upload-excel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] })
      toast.success('Tải lên thời khóa biểu từ Excel thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Tải lên thời khóa biểu từ Excel thất bại')
    }
  })
}

export const useCheckTimetableConflictMutation = () => {
  return useMutation({
    mutationFn: (data: TimetableConflictCheckDto) => api.post(`${API_ROUTES.TIMETABLES}/check-conflict`, data)
  })
}

import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import type { UpdateStandardLectureHoursDto } from '@/shared/validations/StandardLectureHoursSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetStandardLectureHoursQuery = () => {
  return useQuery({
    queryKey: ['standard-lecture-hours'],
    queryFn: () => api.get(API_ROUTES.STANDARD_LECTURE_HOURS)
  })
}

export const useUpdateStandardLectureHoursMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateStandardLectureHoursDto) => api.put(API_ROUTES.STANDARD_LECTURE_HOURS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standard-lecture-hours'] })
      toast.success('Cập nhật số tiết định mức thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật số tiết định mức thất bại')
    }
  })
}


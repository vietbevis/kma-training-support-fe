import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type {
  AcademicYearResponseSchemaType,
  AcademicYearsResponseSchemaType,
  CreateAcademicYearSchemaType,
  DeleteAcademicYearSchemaType,
  UpdateAcademicYearSchemaType
} from '@/shared/validations/AcademicYearSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetAcademicYearsQuery = ({
  page = 1,
  limit = 10,
  search = ''
}: {
  page?: number
  limit?: number
  search?: string
}) => {
  return useQuery({
    queryKey: ['academic-years', normalizeObject({ page, limit, search })],
    queryFn: () =>
      api.get<AcademicYearsResponseSchemaType>(API_ROUTES.ACADEMIC_YEARS, {
        params: normalizeObject({ page, limit, search })
      })
  })
}

export const useCreateAcademicYearMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAcademicYearSchemaType) =>
      api.post<AcademicYearResponseSchemaType>(API_ROUTES.ACADEMIC_YEARS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-years'] })
      toast.success('Thêm năm học thành công')
    },
    onError: () => {
      toast.error('Thêm năm học thất bại')
    }
  })
}

export const useUpdateAcademicYearMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAcademicYearSchemaType }) =>
      api.put<AcademicYearResponseSchemaType>(`${API_ROUTES.ACADEMIC_YEARS}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-years'] })
      toast.success('Cập nhật năm học thành công')
    },
    onError: () => {
      toast.error('Cập nhật năm học thất bại')
    }
  })
}

export const useDeleteAcademicYearMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<DeleteAcademicYearSchemaType>(`${API_ROUTES.ACADEMIC_YEARS}/${id}/hard`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-years'] })
      toast.success('Xóa năm học thành công')
    },
    onError: () => {
      toast.error('Xóa năm học thất bại')
    }
  })
}

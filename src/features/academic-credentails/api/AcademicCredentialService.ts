import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type {
  AcademicCredentialResponse,
  AcademicCredentialsResponse,
  CreateAcademicCredentialSchemaType,
  UpdateAcademicCredentialSchemaType
} from '@/shared/validations/AcademicCredentialSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useAcademicCredentialsQuery = ({
  page = 1,
  limit = 10,
  search = ''
}: {
  page?: number
  limit?: number
  search?: string
}) => {
  return useQuery({
    queryKey: ['academic-credentials', normalizeObject({ page, limit, search })],
    queryFn: () =>
      api.get<AcademicCredentialsResponse>(API_ROUTES.ACADEMIC_CREDENTIALS, {
        params: normalizeObject({ page, limit, search })
      })
  })
}

export const useAcademicCredentialsInfiniteQuery = ({ search = '' }: { search?: string }) => {
  return useInfiniteQuery({
    queryKey: ['academic-credentials', normalizeObject({ search })],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<AcademicCredentialsResponse>(API_ROUTES.ACADEMIC_CREDENTIALS, {
        params: normalizeObject({ page: pageParam, limit: 10, search })
      })
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta
      return page < totalPages ? page + 1 : undefined
    }
  })
}

export const useAcademicCredentialDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['academic-credential', id],
    queryFn: () => api.get<AcademicCredentialResponse>(`${API_ROUTES.ACADEMIC_CREDENTIALS}/${id}`)
  })
}

export const useCreateAcademicCredentialMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAcademicCredentialSchemaType) =>
      api.post<AcademicCredentialResponse>(API_ROUTES.ACADEMIC_CREDENTIALS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-credentials'] })
      toast.success('Thêm học hàm/học vị thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Thêm học hàm/học vị thất bại')
    }
  })
}

export const useUpdateAcademicCredentialMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAcademicCredentialSchemaType }) =>
      api.put<AcademicCredentialResponse>(`${API_ROUTES.ACADEMIC_CREDENTIALS}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-credentials'] })
      toast.success('Cập nhật học hàm/học vị thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật học hàm/học vị thất bại')
    }
  })
}

export const useDeleteAcademicCredentialMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`${API_ROUTES.ACADEMIC_CREDENTIALS}/${id}/hard`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-credentials'] })
      toast.success('Xóa học hàm/học vị thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa học hàm/học vị thất bại')
    }
  })
}

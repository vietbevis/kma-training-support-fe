import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type {
  CreateEducationalSystem as CreateEducationalSystemType,
  EducationalSystemResponse,
  EducationalSystemsResponse,
  UpdateEducationalSystem as UpdateEducationalSystemType
} from '@/shared/validations/EducationalSystemSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useEducationalSystemsQuery = ({
  page = 1,
  limit = 10,
  search = '',
  educationLevels,
  tuitions
}: {
  page?: number
  limit?: number
  search?: string
  educationLevels?: string
  tuitions?: string
}) => {
  return useQuery({
    queryKey: ['educational-systems', normalizeObject({ page, limit, search, educationLevels, tuitions })],
    queryFn: () =>
      api.get<EducationalSystemsResponse>(API_ROUTES.EDUCATIONAL_SYSTEMS, {
        params: normalizeObject({ page, limit, search, educationLevels, tuitions })
      })
  })
}

export const useEducationalSystemsOptionsInfiniteQuery = ({ search = '' }: { search?: string }) => {
  return useInfiniteQuery({
    queryKey: ['educational-systems', normalizeObject({ search })],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<EducationalSystemsResponse>(`${API_ROUTES.EDUCATIONAL_SYSTEMS}/options`, {
        params: normalizeObject({
          page: pageParam,
          limit: 10,
          search
        })
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

export const useEducationalSystemsInfiniteQuery = ({
  search = '',
  educationLevels,
  tuitions
}: {
  search?: string
  educationLevels?: string
  tuitions?: string
}) => {
  return useInfiniteQuery({
    queryKey: ['educational-systems', normalizeObject({ search, educationLevels, tuitions })],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<EducationalSystemsResponse>(API_ROUTES.EDUCATIONAL_SYSTEMS, {
        params: normalizeObject({
          page: pageParam,
          limit: 10,
          search,
          educationLevels,
          tuitions
        })
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

export const useEducationalSystemDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['educational-system', id],
    queryFn: () => api.get<EducationalSystemResponse>(`${API_ROUTES.EDUCATIONAL_SYSTEMS}/${id}`)
  })
}

export const useCreateEducationalSystemMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEducationalSystemType) =>
      api.post<EducationalSystemResponse>(API_ROUTES.EDUCATIONAL_SYSTEMS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educational-systems'] })
      toast.success('Thêm hệ đào tạo thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Thêm hệ đào tạo thất bại')
    }
  })
}

export const useUpdateEducationalSystemMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEducationalSystemType }) =>
      api.put<EducationalSystemResponse>(`${API_ROUTES.EDUCATIONAL_SYSTEMS}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educational-systems'] })
      toast.success('Cập nhật hệ đào tạo thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật hệ đào tạo thất bại')
    }
  })
}

export const useDeleteEducationalSystemMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`${API_ROUTES.EDUCATIONAL_SYSTEMS}/${id}/hard`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educational-systems'] })
      toast.success('Xóa hệ đào tạo thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa hệ đào tạo thất bại')
    }
  })
}

import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type {
  CreateRoleType,
  GetRoleQueryType,
  PaginationRoleResponseType,
  RoleType,
  UpdateRoleType
} from '@/shared/validations/RoleSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetRoles = (query: Partial<GetRoleQueryType>) => {
  return useQuery({
    queryKey: ['roles', normalizeObject(query)],
    queryFn: () => api.get<PaginationRoleResponseType>(`${API_ROUTES.ROLES}`, { params: normalizeObject(query) })
  })
}

export const useGetRoleById = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => api.get<RoleType>(`${API_ROUTES.ROLES}/${id}`),
    enabled: options?.enabled ?? !!id
  })
}

export const useGetRoleInfinite = (query: Partial<GetRoleQueryType>) => {
  return useInfiniteQuery({
    queryKey: ['roles', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<PaginationRoleResponseType>(`${API_ROUTES.ROLES}`, {
        params: normalizeObject({
          ...query,
          page: pageParam
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

export const useCreateRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRoleType) => api.post<RoleType>(`${API_ROUTES.ROLES}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Thêm vai trò thất bại')
    }
  })
}

export const useUpdateRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateRoleType & { id: string }) =>
      api.put<RoleType>(`${API_ROUTES.ROLES}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật vai trò thất bại')
    }
  })
}

export const useDeleteRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`${API_ROUTES.ROLES}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa vai trò thất bại')
    }
  })
}

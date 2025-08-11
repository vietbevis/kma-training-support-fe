import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type { CreateUser, UpdateUser, UserQuery, UserResponse, UsersResponse } from '@/shared/validations/UserSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetUsersQuery = (query: Partial<UserQuery>) => {
  return useQuery({
    queryKey: ['users', normalizeObject(query)],
    queryFn: () => api.get<UsersResponse>(API_ROUTES.USERS, { params: normalizeObject(query) })
  })
}

export const useInfiniteUserQuery = (query: Partial<UserQuery>) => {
  return useInfiniteQuery({
    queryKey: ['users', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<UsersResponse>(API_ROUTES.USERS, {
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

export const useGetUserDetailQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => api.get<UserResponse>(`${API_ROUTES.USERS}/${id}`),
    enabled: !!id
  })
}

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUser) => api.post<UserResponse>(API_ROUTES.USERS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Thêm nhân viên thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Thêm nhân viên thất bại')
    }
  })
}

export const useUpdateUserMutation = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUser) => api.put<UserResponse>(`${API_ROUTES.USERS}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', id] })
      toast.success('Cập nhật nhân viên thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật nhân viên thất bại')
    }
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`${API_ROUTES.USERS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Xóa nhân viên thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa nhân viên thất bại')
    }
  })
}

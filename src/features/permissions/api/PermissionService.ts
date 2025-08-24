import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import type { PermissionType, UpdatePermission } from '@/shared/validations/PermissionSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetModulePermissions = () => {
  return useQuery({
    queryKey: ['module-permissions'],
    queryFn: () => api.get<string[]>(`${API_ROUTES.PERMISSIONS}/modules`)
  })
}

export const useGetPermissionByModule = (module: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['permission-by-module', module],
    queryFn: () => api.get<PermissionType[]>(`${API_ROUTES.PERMISSIONS}/module/${module}`),
    enabled
  })
}

export const useGetPermissionByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['permission-by-user', userId],
    queryFn: () => api.get<PermissionType[]>(`${API_ROUTES.ACCOUNTS}/${userId}/permissions`)
  })
}

export const useUpdatePermission = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: UpdatePermission & { id: string }) =>
      api.put<PermissionType>(`${API_ROUTES.PERMISSIONS}/${id}`, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['permission-by-module', data.data.module] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật quyền thất bại')
    }
  })
}

export const useGetPermissionByRoleId = (roleId: string) => {
  return useQuery({
    queryKey: ['permission-by-role', roleId],
    queryFn: () => api.get<PermissionType[]>(`${API_ROUTES.PERMISSIONS}/role/${roleId}`)
  })
}

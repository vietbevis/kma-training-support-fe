import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { getErrorMessage, normalizeObject } from '@/shared/lib/utils'
import type { AccountResponse, AccountsResponse, UpdateAccount } from '@/shared/validations/AccountSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetAccountsQuery = ({
  page,
  limit,
  search,
  facultyDepartmentId
}: {
  page?: number
  limit?: number
  search?: string
  facultyDepartmentId?: string
}) => {
  return useQuery({
    queryKey: ['accounts', normalizeObject({ page, limit, search, facultyDepartmentId })],
    queryFn: () =>
      api.get<AccountsResponse>(API_ROUTES.ACCOUNTS, {
        params: normalizeObject({ page, limit, search, facultyDepartmentId })
      })
  })
}

export const useGetAccountDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => api.get<AccountResponse>(`${API_ROUTES.ACCOUNTS}/${id}`)
  })
}

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccount }) =>
      api.put<AccountResponse>(`${API_ROUTES.ACCOUNTS}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Cập nhật tài khoản thành công')
    },
    onError: (error) => {
      toast.error('Cập nhật tài khoản thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type {
  CreateExemptionPercentage,
  ExemptionPercentageResponse,
  ExemptionPercentagesResponse,
  UpdateExemptionPercentage
} from '@/shared/validations/ExemptionPercentageSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useExemptionPercentagesQuery = ({
  page = '1',
  limit = '10',
  search = ''
}: {
  page?: string
  limit?: string
  search?: string
}) => {
  return useQuery({
    queryKey: ['exemption-percentages', normalizeObject({ page, limit, search })],
    queryFn: () =>
      api.get<ExemptionPercentagesResponse>(API_ROUTES.EXEMPTION_PERCENTAGES, {
        params: normalizeObject({ page, limit, search })
      })
  })
}

export const useExemptionPercentagesInfiniteQuery = ({ search = '' }: { search?: string }) => {
  return useInfiniteQuery({
    queryKey: ['exemption-percentages', normalizeObject({ search })],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<ExemptionPercentagesResponse>(API_ROUTES.EXEMPTION_PERCENTAGES, {
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

export const useExemptionPercentageDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['exemption-percentage', id],
    queryFn: () => api.get<ExemptionPercentageResponse>(`${API_ROUTES.EXEMPTION_PERCENTAGES}/${id}`)
  })
}

export const useCreateExemptionPercentageMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateExemptionPercentage) =>
      api.post<ExemptionPercentageResponse>(API_ROUTES.EXEMPTION_PERCENTAGES, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exemption-percentages'] })
      toast.success('Thêm phần trăm miễn giảm thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Thêm phần trăm miễn giảm thất bại')
    }
  })
}

export const useUpdateExemptionPercentageMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExemptionPercentage }) =>
      api.put<ExemptionPercentageResponse>(`${API_ROUTES.EXEMPTION_PERCENTAGES}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exemption-percentages'] })
      toast.success('Cập nhật phần trăm miễn giảm thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật phần trăm miễn giảm thất bại')
    }
  })
}

export const useDeleteExemptionPercentageMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`${API_ROUTES.EXEMPTION_PERCENTAGES}/${id}/hard`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exemption-percentages'] })
      toast.success('Xóa phần trăm miễn giảm thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa phần trăm miễn giảm thất bại')
    }
  })
}

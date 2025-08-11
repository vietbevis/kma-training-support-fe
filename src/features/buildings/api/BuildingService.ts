import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type {
  BuildingResponse,
  BuildingsResponse,
  CreateBuildingSchemaType as CreateBuilding,
  UpdateBuildingSchemaType as UpdateBuilding
} from '@/shared/validations/BuildingSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetBuildingsQuery = ({
  page = 1,
  limit = 10,
  search = ''
}: {
  page?: number
  limit?: number
  search?: string
}) => {
  return useQuery({
    queryKey: ['buildings', normalizeObject({ page, limit, search })],
    queryFn: () =>
      api.get<BuildingsResponse>(API_ROUTES.BUILDINGS, { params: normalizeObject({ page, limit, search }) })
  })
}

export const useGetBuildingsInfiniteQuery = ({ search = '' }: { search?: string }) => {
  return useInfiniteQuery({
    queryKey: ['buildings', normalizeObject({ search })],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<BuildingsResponse>(API_ROUTES.BUILDINGS, {
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

export const useGetBuildingDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['building', id],
    queryFn: () => api.get<BuildingResponse>(`${API_ROUTES.BUILDINGS}/${id}`)
  })
}

export const useCreateBuildingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBuilding) => api.post<BuildingResponse>(API_ROUTES.BUILDINGS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] })
      toast.success('Tạo tòa nhà thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Tạo tòa nhà thất bại')
    }
  })
}

export const useUpdateBuildingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBuilding }) =>
      api.put<BuildingResponse>(`${API_ROUTES.BUILDINGS}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] })
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
      toast.success('Cập nhật tòa nhà thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật tòa nhà thất bại')
    }
  })
}

export const useDeleteBuildingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`${API_ROUTES.BUILDINGS}/${id}/hard`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] })
      toast.success('Xóa tòa nhà thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa tòa nhà thất bại')
    }
  })
}

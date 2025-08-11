import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type {
  ClassroomResponse,
  ClassroomsResponse,
  CreateClassroomSchemaType as CreateClassroom,
  UpdateClassroomSchemaType as UpdateClassroom
} from '@/shared/validations/ClassroomSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetClassroomsQuery = ({
  page = 1,
  limit = 10,
  search = '',
  buildingId = ''
}: {
  page?: number
  limit?: number
  search?: string
  buildingId?: string
}) => {
  return useQuery({
    queryKey: ['classrooms', normalizeObject({ page, limit, search, buildingId })],
    queryFn: () =>
      api.get<ClassroomsResponse>(API_ROUTES.CLASSROOMS, {
        params: normalizeObject({ page, limit, search, buildingId })
      })
  })
}

export const useInfiniteClassroomQuery = ({ search = '' }: { search?: string }) => {
  return useInfiniteQuery({
    queryKey: ['classrooms', normalizeObject({ search })],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<ClassroomsResponse>(API_ROUTES.CLASSROOMS, {
        params: normalizeObject({ search, page: pageParam })
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

export const useGetClassroomDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['classroom', id],
    queryFn: () => api.get<ClassroomResponse>(`${API_ROUTES.CLASSROOMS}/${id}`)
  })
}

export const useCreateClassroomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateClassroom) => api.post<ClassroomResponse>(API_ROUTES.CLASSROOMS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
      toast.success('Tạo phòng học thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Tạo phòng học thất bại')
    }
  })
}

export const useUpdateClassroomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassroom }) =>
      api.put<ClassroomResponse>(`${API_ROUTES.CLASSROOMS}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
      toast.success('Cập nhật phòng học thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật phòng học thất bại')
    }
  })
}

export const useDeleteClassroomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`${API_ROUTES.CLASSROOMS}/${id}/hard`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
      toast.success('Xóa phòng học thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa phòng học thất bại')
    }
  })
}

import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type {
  CreateSubjectSchemaType,
  GetSubjectsSchemaType,
  SubjectResponseSchemaType,
  SubjectsResponseSchemaType,
  UpdateSubjectSchemaType
} from '@/shared/validations/SubjectsSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetSubjectsQuery = (query: Partial<GetSubjectsSchemaType>) => {
  return useQuery({
    queryKey: ['subjects', normalizeObject(query)],
    queryFn: () =>
      api.get<SubjectsResponseSchemaType>(API_ROUTES.SUBJECTS, {
        params: normalizeObject(query)
      })
  })
}

export const useInfiniteSubjectQuery = (query: Partial<GetSubjectsSchemaType>) => {
  return useInfiniteQuery({
    queryKey: ['subjects', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<SubjectsResponseSchemaType>(API_ROUTES.SUBJECTS, {
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
      return totalPages > page ? page + 1 : undefined
    }
  })
}

export const useGetSubjectDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['subject', id],
    queryFn: () => api.get<SubjectResponseSchemaType>(`${API_ROUTES.SUBJECTS}/${id}`)
  })
}

export const useCreateSubjectMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSubjectSchemaType) => api.post<SubjectResponseSchemaType>(API_ROUTES.SUBJECTS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Tạo bộ môn thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Tạo bộ môn thất bại')
    }
  })
}

export const useUpdateSubjectMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubjectSchemaType }) =>
      api.put<SubjectResponseSchemaType>(`${API_ROUTES.SUBJECTS}/${id}`, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      queryClient.invalidateQueries({ queryKey: ['subject', res.data.id] })
      toast.success('Cập nhật bộ môn thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật bộ môn thất bại')
    }
  })
}

export const useDeleteSubjectMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`${API_ROUTES.SUBJECTS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Xóa bộ môn thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa bộ môn thất bại')
    }
  })
}

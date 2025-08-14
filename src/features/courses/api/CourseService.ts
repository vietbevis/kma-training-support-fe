import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type {
  CourseQuery,
  CourseResponse,
  CoursesResponse,
  CreateCourse,
  UpdateCourse
} from '@/shared/validations/CourseSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetCoursesQuery = (query: Partial<CourseQuery>) => {
  return useQuery({
    queryKey: ['courses', normalizeObject(query)],
    queryFn: () =>
      api.get<CoursesResponse>(API_ROUTES.COURSES, {
        params: normalizeObject(query)
      })
  })
}

export const useInfiniteCourseQuery = (query: Partial<CourseQuery>) => {
  return useInfiniteQuery({
    queryKey: ['courses', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<CoursesResponse>(API_ROUTES.COURSES, {
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

export const useGetCourseDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => api.get<CourseResponse>(`${API_ROUTES.COURSES}/${id}`)
  })
}

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCourse) => api.post<CourseResponse>(API_ROUTES.COURSES, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Tạo học phần thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Tạo học phần thất bại')
    }
  })
}

export const useUpdateCourseMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourse }) =>
      api.put<CourseResponse>(`${API_ROUTES.COURSES}/${id}`, normalizeObject(data)),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['course', res.data.id] })
      toast.success('Cập nhật học phần thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật học phần thất bại')
    }
  })
}

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`${API_ROUTES.COURSES}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Xóa học phần thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa học phần thất bại')
    }
  })
}

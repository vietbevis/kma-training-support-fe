import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { getErrorMessage, normalizeObject } from '@/shared/lib/utils'
import type {
  CreateFacultyDepartmentSchemaType,
  FacultyDepartmentResponseSchemaType,
  FacultyDepartmentsResponseSchemaType,
  GetFacultyDepartmentsSchemaType,
  UpdateFacultyDepartmentSchemaType
} from '@/shared/validations/FacultyDepartmentSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { id } from 'date-fns/locale'
import { toast } from 'sonner'

export const useFacultyDepartmentsQuery = ({
  search,
  page = 1,
  limit = 10,
  isFaculty
}: {
  search?: string
  page?: number
  limit?: number
  isFaculty?: boolean
}) => {
  return useQuery({
    queryKey: ['faculty-departments', normalizeObject({ search, page, limit, isFaculty })],
    queryFn: () =>
      api.get<FacultyDepartmentsResponseSchemaType>(API_ROUTES.FACULTY_DEPARTMENTS, {
        params: normalizeObject({ search, page, limit, isFaculty })
      })
  })
}

export const useInfiniteFacultyDepartmentQuery = (query: Partial<GetFacultyDepartmentsSchemaType>) => {
  return useInfiniteQuery({
    queryKey: ['faculty-departments', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<FacultyDepartmentsResponseSchemaType>(API_ROUTES.FACULTY_DEPARTMENTS, {
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

export const useGetFacultyDepartmentDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['faculty-department', id],
    queryFn: () => api.get<FacultyDepartmentResponseSchemaType>(`${API_ROUTES.FACULTY_DEPARTMENTS}/${id}`)
  })
}

export const useCreateFacultyDepartmentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFacultyDepartmentSchemaType) =>
      api.post<FacultyDepartmentResponseSchemaType>(API_ROUTES.FACULTY_DEPARTMENTS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty-departments'] })
      toast.success('Tạo khoa/phòng ban thành công')
    },
    onError: (error) => {
      toast.error('Tạo khoa/phòng ban thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useUpdateFacultyDepartmentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFacultyDepartmentSchemaType }) =>
      api.put<FacultyDepartmentResponseSchemaType>(`${API_ROUTES.FACULTY_DEPARTMENTS}/${id}`, data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['faculty-departments'] })
      queryClient.invalidateQueries({ queryKey: ['faculty-department', id] })
      toast.success('Cập nhật khoa/phòng ban thành công')
    },
    onError: (error) => {
      toast.error('Cập nhật khoa/phòng ban thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

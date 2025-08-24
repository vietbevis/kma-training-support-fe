import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type {
  ApproveVisitingLecturer,
  CreateVisitingLecturer,
  RejectVisitingLecturer,
  UpdateVisitingLecturer,
  VisitingLecturerQuery,
  VisitingLecturerResponse,
  VisitingLecturersResponse
} from '@/shared/validations/VisitingLecturerSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetVisitingLecturersQuery = (query: Partial<VisitingLecturerQuery>) => {
  return useQuery({
    queryKey: ['visiting-lecturers', normalizeObject(query)],
    queryFn: () => api.get<VisitingLecturersResponse>(API_ROUTES.VISITING_LECTURERS, { params: normalizeObject(query) })
  })
}

export const useInfiniteVisitingLecturerQuery = (query: Partial<VisitingLecturerQuery>) => {
  return useInfiniteQuery({
    queryKey: ['visiting-lecturers', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<VisitingLecturersResponse>(API_ROUTES.VISITING_LECTURERS, {
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

export const useGetVisitingLecturerDetailQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['visiting-lecturer', id],
    queryFn: () => api.get<VisitingLecturerResponse>(`${API_ROUTES.VISITING_LECTURERS}/${id}`),
    enabled: !!id
  })
}

export const useCreateVisitingLecturerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVisitingLecturer) =>
      api.post<VisitingLecturerResponse>(API_ROUTES.VISITING_LECTURERS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visiting-lecturers'] })
      toast.success('Thêm giảng viên mời thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Thêm giảng viên mời thất bại')
    }
  })
}

export const useUpdateVisitingLecturerMutation = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateVisitingLecturer) =>
      api.put<VisitingLecturerResponse>(`${API_ROUTES.VISITING_LECTURERS}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visiting-lecturers'] })
      queryClient.invalidateQueries({ queryKey: ['visiting-lecturer', id] })
      toast.success('Cập nhật giảng viên mời thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật giảng viên mời thất bại')
    }
  })
}

export const useDeleteVisitingLecturerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`${API_ROUTES.VISITING_LECTURERS}/${id}/hard`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visiting-lecturers'] })
      toast.success('Xóa giảng viên mời thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa giảng viên mời thất bại')
    }
  })
}

// đào tạo duyệt
export const useTrainingApproveVisitingLecturerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveVisitingLecturer }) =>
      api.post(`${API_ROUTES.VISITING_LECTURERS}/${id}/training-approve`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visiting-lecturers'] })
      toast.success('Đào tạo duyệt giảng viên mời thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Đào tạo duyệt giảng viên mời thất bại')
    }
  })
}

// đào tạo bỏ duyệt của khoa
export const useTrainingRejectFacultyVisitingLecturerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RejectVisitingLecturer }) =>
      api.post(`${API_ROUTES.VISITING_LECTURERS}/${id}/training-reject-faculty`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visiting-lecturers'] })
      toast.success('Đào tạo bỏ duyệt khoa thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Đào tạo bỏ duyệt khoa thất bại')
    }
  })
}

// khoa duyệt
export const useFacultyApproveVisitingLecturerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveVisitingLecturer }) =>
      api.post(`${API_ROUTES.VISITING_LECTURERS}/${id}/faculty-approve`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visiting-lecturers'] })
      toast.success('Khoa duyệt giảng viên mời thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Khoa duyệt giảng viên mời thất bại')
    }
  })
}

// học viện bỏ duyệt
export const useAcademyRejectVisitingLecturerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RejectVisitingLecturer }) =>
      api.post(`${API_ROUTES.VISITING_LECTURERS}/${id}/academy-reject`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visiting-lecturers'] })
      toast.success('Học viện bỏ duyệt thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Học viện bỏ duyệt thất bại')
    }
  })
}

// học viện duyệt
export const useAcademyApproveVisitingLecturerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveVisitingLecturer }) =>
      api.post(`${API_ROUTES.VISITING_LECTURERS}/${id}/academy-approve`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visiting-lecturers'] })
      toast.success('Học viện duyệt giảng viên mời thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Học viện duyệt giảng viên mời thất bại')
    }
  })
}

// học viện bỏ duyệt của đào tạo
export const useAcademyRejectTrainningVisitingLecturerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RejectVisitingLecturer }) =>
      api.post(`${API_ROUTES.VISITING_LECTURERS}/${id}/academy-reject-training`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visiting-lecturers'] })
      toast.success('Học viện bỏ duyệt đào tạo thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Học viện bỏ duyệt đào tạo thất bại')
    }
  })
}

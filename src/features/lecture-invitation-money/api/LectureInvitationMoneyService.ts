import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type {
  CreateLectureInvitationMoney,
  LectureInvitationMoneyResponse,
  LectureInvitationMoneysResponse,
  UpdateLectureInvitationMoney
} from '@/shared/validations/LectureInvitationMoneySchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useLectureInvitationMoneysQuery = ({
  page = 1,
  limit = 10,
  search = '',
  academicCredentialId
}: {
  page?: number
  limit?: number
  search?: string
  academicCredentialId?: string
}) => {
  return useQuery({
    queryKey: ['lecture-invitation-moneys', normalizeObject({ page, limit, search, academicCredentialId })],
    queryFn: () =>
      api.get<LectureInvitationMoneysResponse>(API_ROUTES.LECTURE_INVITATION_MONEYS, {
        params: normalizeObject({ page, limit, search, academicCredentialId })
      })
  })
}

export const useLectureInvitationMoneysInfiniteQuery = ({ search = '' }: { search?: string }) => {
  return useInfiniteQuery({
    queryKey: ['lecture-invitation-moneys', normalizeObject({ search })],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<LectureInvitationMoneysResponse>(API_ROUTES.LECTURE_INVITATION_MONEYS, {
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

export const useLectureInvitationMoneyDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['lecture-invitation-money', id],
    queryFn: () => api.get<LectureInvitationMoneyResponse>(`${API_ROUTES.LECTURE_INVITATION_MONEYS}/${id}`)
  })
}

export const useCreateLectureInvitationMoneyMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLectureInvitationMoney) =>
      api.post<LectureInvitationMoneyResponse>(API_ROUTES.LECTURE_INVITATION_MONEYS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lecture-invitation-moneys'] })
      toast.success('Thêm tiền mời giảng thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Thêm tiền mời giảng thất bại')
    }
  })
}

export const useUpdateLectureInvitationMoneyMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLectureInvitationMoney }) =>
      api.put<LectureInvitationMoneyResponse>(`${API_ROUTES.LECTURE_INVITATION_MONEYS}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lecture-invitation-moneys'] })
      toast.success('Cập nhật tiền mời giảng thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật tiền mời giảng thất bại')
    }
  })
}

export const useDeleteLectureInvitationMoneyMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`${API_ROUTES.LECTURE_INVITATION_MONEYS}/${id}/hard`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lecture-invitation-moneys'] })
      toast.success('Xóa tiền mời giảng thành công')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xóa tiền mời giảng thất bại')
    }
  })
}

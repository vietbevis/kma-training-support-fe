import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { normalizeObject } from '@/shared/lib/utils'
import type { AuditLogQuery, AuditLogResponse } from '@/shared/validations/AuditLogSchema'
import { useQuery } from '@tanstack/react-query'

export const useGetAuditLogs = (query: Partial<AuditLogQuery>, interval: number = 10000) => {
  return useQuery({
    queryKey: ['audit-logs', normalizeObject(query)],
    queryFn: () => api.get<AuditLogResponse>(API_ROUTES.AUDIT_LOGS, { params: normalizeObject(query) }),
    refetchInterval: interval,
    refetchIntervalInBackground: false, // Chỉ refetch khi tab active
    refetchOnWindowFocus: false // Không refetch khi focus vào tab
  })
}

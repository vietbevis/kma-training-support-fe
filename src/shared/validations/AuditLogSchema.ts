import { z } from 'zod'
import { BaseEntityDTO, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const ActionSchema = z.enum([
  'CREATE',
  'UPDATE',
  'DELETE',
  'SOFT_DELETE',
  'RESTORE',
  'LOGIN',
  'LOGOUT',
  'FAILED_LOGIN',
  'PASSWORD_CHANGE',
  'PERMISSION_CHANGE',
  'EXPORT',
  'IMPORT',
  'VIEW',
  'DOWNLOAD',
  'UPLOAD',
  'CUSTOM'
])

export type ActionType = z.infer<typeof ActionSchema>

export const AuditLogSchema = BaseEntityDTO.extend({
  action: ActionSchema,
  entityName: z.string(),
  entityId: z.string(),
  userId: z.string(),
  user: z.object({
    id: z.string(),
    fullName: z.string(),
    code: z.string(),
    email: z.string(),
    username: z.string(),
    position: z.string(),
    facultyDepartment: z.object({
      id: z.string(),
      name: z.string(),
      code: z.string()
    })
  }),
  ipAddress: z.string(),
  userAgent: z.string(),
  oldValues: z.any(),
  newValues: z.any(),
  changedFields: z.array(z.string()),
  httpMethod: z.string(),
  endpoint: z.string(),
  requestParams: z.any(),
  requestBody: z.any(),
  responseStatus: z.any(),
  responseTime: z.any(),
  status: z.string(),
  description: z.string(),
  errorMessage: z.any(),
  errorStack: z.any(),
  metadata: z.any()
}).strip()

export type AuditLog = z.infer<typeof AuditLogSchema>

export const AuditLogResponseSchema = z.object({
  data: z.array(AuditLogSchema),
  meta: MetaPagination
})

export type AuditLogResponse = z.infer<typeof AuditLogResponseSchema>

export const PaginationAuditLog = createPaginationQuerySchema()

export const AuditLogQuerySchema = PaginationAuditLog.extend({
  action: ActionSchema.optional(),
  entityName: z.string().optional(),
  userId: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional()
})

export type AuditLogQuery = z.infer<typeof AuditLogQuerySchema>

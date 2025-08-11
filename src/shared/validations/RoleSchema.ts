import z from 'zod'
import { BaseEntityDTO, createPaginationQuerySchema, MetaPagination } from './CommonSchema'
import { PermissionSchema } from './PermissionSchema'

export const FacultyDepartmentInRoleSchema = BaseEntityDTO.extend({
  code: z.string(),
  name: z.string()
}).nullable()

export type FacultyDepartmentInRoleType = z.infer<typeof FacultyDepartmentInRoleSchema>

export const RoleSchema = BaseEntityDTO.extend({
  name: z.string(),
  description: z.string(),
  isActive: z.boolean().default(true),
  isSystemRole: z.boolean().default(false),
  scopeFacultyDepartment: FacultyDepartmentInRoleSchema,
  permissions: z.array(PermissionSchema)
})

export type RoleType = z.infer<typeof RoleSchema>

export const CreateRoleSchema = z.object({
  name: z.string().min(1, { message: 'Tên vai trò không được để trống' }),
  description: z.string().min(1, { message: 'Mô tả không được để trống' }),
  scopeFacultyDepartmentId: z.string().uuid().optional(),
  permissionIds: z.array(z.string().uuid()).optional()
})

export type CreateRoleType = z.infer<typeof CreateRoleSchema>

export const UpdateRoleSchema = CreateRoleSchema

export type UpdateRoleType = z.infer<typeof UpdateRoleSchema>

export const PaginationRoleSchema = createPaginationQuerySchema()

export const GetRoleQuerySchema = PaginationRoleSchema.extend({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  isSystemRole: z.boolean().optional(),
  scopeFacultyDepartmentId: z.string().uuid().optional()
})

export type GetRoleQueryType = z.infer<typeof GetRoleQuerySchema>

export const GetRoleDetailQuerySchema = z.object({
  id: z.string().uuid()
})

export type GetRoleDetailQueryType = z.infer<typeof GetRoleDetailQuerySchema>

export const PaginationRoleResponseSchema = z.object({
  data: z.array(RoleSchema),
  meta: MetaPagination
})

export type PaginationRoleResponseType = z.infer<typeof PaginationRoleResponseSchema>

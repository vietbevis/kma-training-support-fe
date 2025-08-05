import { z } from 'zod'
import { BaseEntityDTO, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateFacultyDepartmentSchema = z
  .object({
    name: z.string().min(1, 'Tên khoa không được để trống'),
    code: z.string().min(1, 'Mã khoa không được để trống'),
    isFaculty: z.boolean(),
    description: z.string()
  })
  .strict()
  .strip()

export const UpdateFacultyDepartmentSchema = z
  .object({
    name: z.string().min(1, 'Tên khoa không được để trống'),
    code: z.string().min(1, 'Mã khoa không được để trống'),
    isFaculty: z.boolean(),
    description: z.string()
  })
  .strict()
  .strip()

export const FacultyDepartmentSchema = BaseEntityDTO.extend({
  name: z.string().min(1, 'Tên khoa không được để trống'),
  code: z.string().min(1, 'Mã khoa không được để trống'),
  isFaculty: z.boolean(),
  description: z.string()
}).strip()

export const FacultyDepartmentResponseSchema = FacultyDepartmentSchema

export const PaginationFacultyDepartmentSchema = createPaginationQuerySchema()

export const GetFacultyDepartmentsSchema = PaginationFacultyDepartmentSchema.extend({
  name: z.string().optional(),
  code: z.string().optional(),
  isFaculty: z.enum(['true', 'false']).optional()
})

export const FacultyDepartmentsSchema = z.array(FacultyDepartmentSchema)

export const PaginatedFacultyDepartmentsSchema = z
  .object({
    data: FacultyDepartmentsSchema,
    meta: MetaPagination
  })
  .strip()

export const FacultyDepartmentsResponseSchema = z
  .object({
    data: FacultyDepartmentsSchema,
    meta: MetaPagination
  })
  .strip()

export const MergeFacultyDepartmentSchema = z.object({
  mergeFacultyIds: z.array(z.number()).min(2, 'Phải có ít nhất 2 khoa để gộp'),
  newFacultyName: z.string().min(1, 'Tên khoa mới không được để trống'),
  newFacultyCode: z.string().min(1, 'Mã khoa mới không được để trống'),
  newFacultyDescription: z.string(),
  newFacultyHeadOfFacultyId: z.number().optional()
})

export type GetFacultyDepartmentsSchemaType = z.infer<typeof GetFacultyDepartmentsSchema>
export type FacultyDepartmentResponseSchemaType = z.infer<typeof FacultyDepartmentResponseSchema>
export type FacultyDepartmentSchemaType = z.infer<typeof FacultyDepartmentSchema>
export type CreateFacultyDepartmentSchemaType = z.infer<typeof CreateFacultyDepartmentSchema>
export type UpdateFacultyDepartmentSchemaType = z.infer<typeof UpdateFacultyDepartmentSchema>
export type MergeFacultyDepartmentSchemaType = z.infer<typeof MergeFacultyDepartmentSchema>
export type FacultyDepartmentsResponseSchemaType = z.infer<typeof FacultyDepartmentsResponseSchema>
export type FacultyDepartmentsSchemaType = z.infer<typeof FacultyDepartmentsSchema>
export type PaginatedFacultyDepartmentsSchemaType = z.infer<typeof PaginatedFacultyDepartmentsSchema>

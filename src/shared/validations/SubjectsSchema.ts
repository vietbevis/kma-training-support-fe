import { z } from 'zod'
import { BaseEntityDTO, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateSubjectSchema = z
  .object({
    name: z.string().min(1, 'Tên môn học không được để trống'),
    code: z.string().min(1, 'Mã môn học không được để trống'),
    description: z.string(),
    headOfDepartmentId: z.string().optional(),
    facultyDepartmentId: z
      .string({ message: 'Môn học phải thuộc về 1 khoa nào đó' })
      .min(1, 'Môn học phải thuộc về 1 khoa nào đó')
  })
  .strict()
  .strip()

export const UpdateSubjectSchema = CreateSubjectSchema

export const SubjectSchema = BaseEntityDTO.extend({
  name: z.string().min(1, 'Tên bộ môn không được để trống'),
  code: z.string().min(1, 'Mã bộ môn không được để trống'),
  description: z.string(),
  headOfDepartment: z
    .object({
      id: z.string(),
      fullName: z.string().min(1, 'Tên trưởng bộ môn không được để trống')
    })
    .nullable()
    .default(null),
  facultyDepartment: z.object({
    id: z.string(),
    name: z.string().min(1, 'Tên khoa không được để trống'),
    code: z.string().min(1, 'Mã khoa không được để trống')
  })
}).strip()

export const SubjectResponseSchema = SubjectSchema

export const PaginationSubjectSchema = createPaginationQuerySchema()

export const GetSubjectsSchema = PaginationSubjectSchema.extend({
  search: z.string().optional(),
  facultyDepartmentId: z.string().optional()
})

export const SubjectsSchema = z.array(SubjectSchema)

export const PaginatedSubjectsSchema = z.object({
  data: SubjectsSchema,
  meta: MetaPagination
})

export const SubjectsResponseSchema = z.object({
  data: SubjectsSchema,
  meta: MetaPagination
})

export type GetSubjectsSchemaType = z.infer<typeof GetSubjectsSchema>
export type SubjectResponseSchemaType = z.infer<typeof SubjectResponseSchema>
export type SubjectSchemaType = z.infer<typeof SubjectSchema>
export type CreateSubjectSchemaType = z.infer<typeof CreateSubjectSchema>
export type UpdateSubjectSchemaType = z.infer<typeof UpdateSubjectSchema>
export type SubjectsResponseSchemaType = z.infer<typeof SubjectsResponseSchema>
export type SubjectsSchemaType = z.infer<typeof SubjectsSchema>
export type PaginatedSubjectsSchemaType = z.infer<typeof PaginatedSubjectsSchema>

import { z } from 'zod'
import { BaseEntityDTO, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const EducationLevels = z.enum(['Nghiên cứu sinh', 'Đại học', 'Cao học'])
export const Tuitions = z.enum(['Đóng học phí', 'Mật mã'])

export const CreateEducationalSystemSchema = z
  .object({
    code: z.string().min(1, 'Viết tắt không được để trống'),
    nameClass: z.string().min(1, 'Tên lớp không được để trống'),
    educationLevels: EducationLevels,
    tuitions: Tuitions,
    studentCategory: z.string().min(1, 'Đối tượng không được để trống')
  })
  .strict()
  .strip()

export const UpdateEducationalSystemSchema = CreateEducationalSystemSchema

export const EducationalSystemSchema = BaseEntityDTO.extend({
  code: z.string(),
  nameClass: z.string(),
  educationLevels: EducationLevels,
  tuitions: Tuitions,
  studentCategory: z.string()
}).strip()

export const EducationalSystemResponseSchema = EducationalSystemSchema

export const PaginationEducationalSystemSchema = createPaginationQuerySchema()

export const EducationalSystemQuerySchema = PaginationEducationalSystemSchema.extend({
  search: z.string().optional(),
  educationLevels: EducationLevels.optional(),
  tuitions: Tuitions.optional()
})

export const PaginatedEducationalSystemSchema = z
  .object({
    data: z.array(EducationalSystemSchema),
    meta: MetaPagination
  })
  .strip()

export const EducationalSystemsResponseSchema = z
  .object({
    data: z.array(EducationalSystemSchema),
    meta: MetaPagination
  })
  .strip()

export const DeleteEducationalSystemSchema = z
  .object({
    id: z.number().min(1, 'ID hệ đào tạo không hợp lệ')
  })
  .strip()

export const RestoreEducationalSystemSchema = z
  .object({
    id: z.number().min(1, 'ID hệ đào tạo không hợp lệ')
  })
  .strip()

export type EducationalSystem = z.infer<typeof EducationalSystemSchema>
export type EducationalSystems = z.infer<typeof PaginatedEducationalSystemSchema>
export type EducationalSystemResponse = z.infer<typeof EducationalSystemResponseSchema>
export type EducationalSystemsResponse = z.infer<typeof EducationalSystemsResponseSchema>
export type PaginationEducationalSystem = z.infer<typeof PaginationEducationalSystemSchema>
export type PaginatedEducationalSystem = z.infer<typeof PaginatedEducationalSystemSchema>
export type CreateEducationalSystem = z.infer<typeof CreateEducationalSystemSchema>
export type UpdateEducationalSystem = z.infer<typeof UpdateEducationalSystemSchema>
export type EducationalSystemQuery = z.infer<typeof EducationalSystemQuerySchema>
export type DeleteEducationalSystem = z.infer<typeof DeleteEducationalSystemSchema>
export type RestoreEducationalSystem = z.infer<typeof RestoreEducationalSystemSchema>

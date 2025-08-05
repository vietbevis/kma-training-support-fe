import { z } from 'zod'
import { BaseEntityDTO, BaseResponseSchema, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateAcademicCredentialSchema = z
  .object({
    name: z.string().min(1, 'Tên học hàm/học vị không được để trống'),
    description: z.string().optional()
  })
  .strict()
  .strip()

export const UpdateAcademicCredentialSchema = CreateAcademicCredentialSchema

export const AcademicCredentialSchema = BaseEntityDTO.extend({
  name: z.string(),
  description: z.string().nullable().optional()
}).strip()

export const AcademicCredentialResponseSchema = z
  .object({
    data: AcademicCredentialSchema
  })
  .strip()

export const PaginationAcademicCredentialSchema = createPaginationQuerySchema()

export const AcademicCredentialQuerySchema = PaginationAcademicCredentialSchema.extend({
  name: z.string().optional()
})

export const PaginatedAcademicCredentialsSchema = z
  .object({
    data: z.array(AcademicCredentialSchema),
    meta: MetaPagination
  })
  .strip()

export const AcademicCredentialsResponseSchema = z
  .object({
    data: z.array(AcademicCredentialSchema),
    meta: MetaPagination
  })
  .strip()

export const DeleteAcademicCredentialSchema = BaseResponseSchema.extend({
  data: z.object({
    id: z.number().min(1, 'ID học hàm/học vị không hợp lệ')
  })
}).strip()

export type AcademicCredential = z.infer<typeof AcademicCredentialSchema>
export type AcademicCredentials = z.infer<typeof PaginatedAcademicCredentialsSchema>
export type AcademicCredentialResponse = z.infer<typeof AcademicCredentialResponseSchema>
export type AcademicCredentialsResponse = z.infer<typeof AcademicCredentialsResponseSchema>
export type PaginationAcademicCredential = z.infer<typeof PaginationAcademicCredentialSchema>
export type PaginatedAcademicCredentials = z.infer<typeof PaginatedAcademicCredentialsSchema>
export type CreateAcademicCredentialSchemaType = z.infer<typeof CreateAcademicCredentialSchema>
export type UpdateAcademicCredentialSchemaType = z.infer<typeof UpdateAcademicCredentialSchema>
export type AcademicCredentialQuery = z.infer<typeof AcademicCredentialQuerySchema>
export type DeleteAcademicCredential = z.infer<typeof DeleteAcademicCredentialSchema>

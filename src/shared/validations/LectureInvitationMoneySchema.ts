import { z } from 'zod'
import { BaseEntityDTO, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateLectureInvitationMoneySchema = z
  .object({
    money: z.string().min(1, 'Số tiền không được để trống'),
    educationalSystem: z.string().min(1, 'Hệ đào tạo không được để trống'),
    academicCredentialId: z.string().min(1, 'Học hàm/học vị không được để trống')
  })
  .strict()
  .strip()

export const UpdateLectureInvitationMoneySchema = CreateLectureInvitationMoneySchema

export const LectureInvitationMoneySchema = BaseEntityDTO.extend({
  money: z.string(),
  educationalSystem: z.string(),
  academicCredential: BaseEntityDTO.extend({
    name: z.string(),
    description: z.string()
  })
}).strip()

export const LectureInvitationMoneyResponseSchema = LectureInvitationMoneySchema

export const PaginationLectureInvitationMoneySchema = createPaginationQuerySchema()

export const LectureInvitationMoneyQuerySchema = PaginationLectureInvitationMoneySchema.extend({
  search: z.string().optional(),
  academicCredentialId: z.string().optional()
})

export const PaginatedLectureInvitationMoneySchema = z
  .object({
    data: z.array(LectureInvitationMoneySchema),
    meta: MetaPagination
  })
  .strip()

export const LectureInvitationMoneysResponseSchema = z
  .object({
    data: z.array(LectureInvitationMoneySchema),
    meta: MetaPagination
  })
  .strip()

export const DeleteLectureInvitationMoneySchema = z
  .object({
    id: z.number().min(1, 'ID tiền mời giảng không hợp lệ')
  })
  .strip()

export const RestoreLectureInvitationMoneySchema = z
  .object({
    id: z.number().min(1, 'ID tiền mời giảng không hợp lệ')
  })
  .strip()

export type LectureInvitationMoney = z.infer<typeof LectureInvitationMoneySchema>
export type LectureInvitationMoneys = z.infer<typeof PaginatedLectureInvitationMoneySchema>
export type LectureInvitationMoneyResponse = z.infer<typeof LectureInvitationMoneyResponseSchema>
export type LectureInvitationMoneysResponse = z.infer<typeof LectureInvitationMoneysResponseSchema>
export type PaginationLectureInvitationMoney = z.infer<typeof PaginationLectureInvitationMoneySchema>
export type PaginatedLectureInvitationMoney = z.infer<typeof PaginatedLectureInvitationMoneySchema>
export type CreateLectureInvitationMoney = z.infer<typeof CreateLectureInvitationMoneySchema>
export type UpdateLectureInvitationMoney = z.infer<typeof UpdateLectureInvitationMoneySchema>
export type LectureInvitationMoneyQuery = z.infer<typeof LectureInvitationMoneyQuerySchema>
export type DeleteLectureInvitationMoney = z.infer<typeof DeleteLectureInvitationMoneySchema>
export type RestoreLectureInvitationMoney = z.infer<typeof RestoreLectureInvitationMoneySchema>

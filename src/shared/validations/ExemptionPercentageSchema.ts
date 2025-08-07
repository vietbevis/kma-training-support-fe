import { z } from 'zod'
import { BaseEntityDTO, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateExemptionPercentageSchema = z
  .object({
    reason: z.string().min(1, 'Lý do miễn giảm không được để trống'),
    percentage: z
      .number()
      .min(0, 'Phần trăm miễn giảm không được nhỏ hơn 0')
      .max(100, 'Phần trăm miễn giảm không được lớn hơn 100')
  })
  .strict()
  .strip()

export const UpdateExemptionPercentageSchema = CreateExemptionPercentageSchema

export const ExemptionPercentageSchema = BaseEntityDTO.extend({
  reason: z.string(),
  percentage: z.coerce.number()
}).strip()

export const ExemptionPercentageResponseSchema = ExemptionPercentageSchema

export const PaginationExemptionPercentageSchema = createPaginationQuerySchema()

export const ExemptionPercentageQuerySchema = PaginationExemptionPercentageSchema

export const PaginatedExemptionPercentageSchema = z
  .object({
    data: z.array(ExemptionPercentageSchema),
    meta: MetaPagination
  })
  .strip()

export const ExemptionPercentagesResponseSchema = z
  .object({
    data: z.array(ExemptionPercentageSchema),
    meta: MetaPagination
  })
  .strip()

export const DeleteExemptionPercentageSchema = z
  .object({
    id: z.number().min(1, 'ID miễn giảm không hợp lệ')
  })
  .strip()

export const RestoreExemptionPercentageSchema = z
  .object({
    id: z.number().min(1, 'ID miễn giảm không hợp lệ')
  })
  .strip()

export type ExemptionPercentage = z.infer<typeof ExemptionPercentageSchema>
export type ExemptionPercentages = z.infer<typeof PaginatedExemptionPercentageSchema>
export type ExemptionPercentageResponse = z.infer<typeof ExemptionPercentageResponseSchema>
export type ExemptionPercentagesResponse = z.infer<typeof ExemptionPercentagesResponseSchema>
export type PaginationExemptionPercentage = z.infer<typeof PaginationExemptionPercentageSchema>
export type PaginatedExemptionPercentage = z.infer<typeof PaginatedExemptionPercentageSchema>
export type CreateExemptionPercentage = z.infer<typeof CreateExemptionPercentageSchema>
export type UpdateExemptionPercentage = z.infer<typeof UpdateExemptionPercentageSchema>
export type ExemptionPercentageQuery = z.infer<typeof ExemptionPercentageQuerySchema>
export type DeleteExemptionPercentage = z.infer<typeof DeleteExemptionPercentageSchema>
export type RestoreExemptionPercentage = z.infer<typeof RestoreExemptionPercentageSchema>

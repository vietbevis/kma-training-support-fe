import { z } from 'zod'
import { BaseEntityDTO, MetaPagination } from './CommonSchema'

export const CreateAcademicYearSchema = z
  .object({
    yearCode: z.string().min(1, 'Năm học không được để trống')
  })
  .strict()
  .strip()

export const UpdateAcademicYearSchema = z
  .object({
    yearCode: z.string().min(1, 'Năm học không được để trống')
  })
  .strict()
  .strip()

export const AcademicYearSchema = BaseEntityDTO.extend({
  yearCode: z.string().min(1, 'Năm học không được để trống')
}).strip()

export const AcademicYearResponseSchema = AcademicYearSchema

export const AcademicYearsSchema = z.array(AcademicYearSchema)

export const AcademicYearsResponseSchema = z.object({
  data: AcademicYearsSchema,
  meta: MetaPagination
})

export const DeleteAcademicYearSchema = z
  .object({
    id: z.string()
  })
  .strip()

export const RestoreAcademicYearSchema = AcademicYearSchema

export type AcademicYearResponseSchemaType = z.infer<typeof AcademicYearResponseSchema>
export type AcademicYearSchemaType = z.infer<typeof AcademicYearSchema>
export type CreateAcademicYearSchemaType = z.infer<typeof CreateAcademicYearSchema>
export type UpdateAcademicYearSchemaType = z.infer<typeof UpdateAcademicYearSchema>
export type AcademicYearsResponseSchemaType = z.infer<typeof AcademicYearsResponseSchema>
export type AcademicYearsSchemaType = z.infer<typeof AcademicYearsSchema>
export type DeleteAcademicYearSchemaType = z.infer<typeof DeleteAcademicYearSchema>
export type RestoreAcademicYearSchemaType = z.infer<typeof RestoreAcademicYearSchema>

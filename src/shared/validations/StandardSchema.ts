import { z } from 'zod'
import { KyHoc } from '../lib/enum'

/**
 * UpdateStandard Schema
 */
export const UpdateStandardSchema = z.object({
  className: z.string({ message: 'Tên lớp học phần cụ thể' }),
  semester: z.enum(KyHoc, { message: 'Kỳ học' }),
  classType: z.string().nullable().optional(),
  studentCount: z.number().int().min(0, 'Số sinh viên phải >= 0'),
  theoryHours: z.number().int().min(0, 'LL phải >= 0'),
  crowdClassCoefficient: z.string(),
  actualHours: z.number().int().min(0, 'LL thực tế phải >= 0'),
  overtimeCoefficient: z.string(),
  standardHours: z.string(),
  startDate: z.coerce.date().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
  lecturerName: z.string(),
  courseId: z.uuid().nullable().optional(),
  academicYearId: z.uuid()
})

export type UpdateStandardDto = z.infer<typeof UpdateStandardSchema>

/**
 * StandardQuery Schema
 */
export const StandardQuerySchema = z.object({
  courseId: z.uuid().optional(),
  academicYearId: z.uuid().optional(),
  semester: z.enum(KyHoc).optional(),
  startDate: z.iso.date().optional(),
  endDate: z.iso.date().optional(),
  className: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
})
export type StandardQueryDto = z.infer<typeof StandardQuerySchema>


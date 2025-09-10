import { z } from 'zod'
import { DayOfWeek, KyHoc } from '../lib/enum'

/**
 * DetailTimeSlots Schema
 */
export const DetailTimeSlotsSchema = z.object({
  dayOfWeek: z.enum(DayOfWeek, { message: 'Thứ' }),
  timeSlot: z.string({ message: 'Tiết học' }),
  roomName: z.string({ message: 'Phòng học' }),
  buildingName: z.string({ message: 'Tòa nhà' }).optional(),
  startDate: z.iso.date({ message: 'Ngày bắt đầu' }),
  endDate: z.iso.date({ message: 'Ngày kết thúc' })
})
export type DetailTimeSlotsDto = z.infer<typeof DetailTimeSlotsSchema>

/**
 * CreateTimetable Schema
 */
export const CreateTimetableSchema = z.object({
  className: z.string({ message: 'Tên lớp học phần cụ thể' }),
  semester: z.enum(KyHoc, { message: 'Kỳ học' }),
  classType: z.string({ message: 'Hình thức học' }),
  studentCount: z.number().int().min(0, 'Số sinh viên phải >= 0'),
  theoryHours: z.number().int().min(0, 'Số tiết lý thuyết >= 0'),
  crowdClassCoefficient: z.number().min(1).max(2),
  actualHours: z.number().min(0),
  overtimeCoefficient: z.number().min(0),
  standardHours: z.number().min(0),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  lecturerName: z.string().optional(),
  detailTimeSlots: z.array(DetailTimeSlotsSchema).nonempty(),
  notes: z.string().optional(),
  courseId: z.uuid(),
  academicYearId: z.uuid()
})
export type CreateTimetableDto = z.infer<typeof CreateTimetableSchema>

/**
 * UpdateTimetable Schema (Partial)
 */
export const UpdateTimetableSchema = z.object({
  className: z.string({ message: 'Tên lớp học phần cụ thể' }),
  semester: z.enum(KyHoc, { message: 'Kỳ học' }),
  classType: z.string({ message: 'Hình thức học' }),
  studentCount: z.number().int().min(0, 'Số sinh viên phải >= 0'),
  theoryHours: z.number().int().min(0, 'LL phải >= 0'),
  actualHours: z.number().int().min(0, 'LL thực tế phải >= 0'),
  overtimeCoefficient: z.number().min(0),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  lecturerName: z.string().optional(),
  courseId: z.uuid(),
  academicYearId: z.uuid()
})

export type UpdateTimetableDto = z.infer<typeof UpdateTimetableSchema>

/**
 * TimetableQuery Schema
 */
export const TimetableQuerySchema = z.object({
  courseId: z.uuid().optional(),
  academicYearId: z.uuid().optional(),
  semester: z.enum(KyHoc).optional(),
  startDate: z.iso.date().optional(),
  endDate: z.iso.date().optional(),
  className: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
})
export type TimetableQueryDto = z.infer<typeof TimetableQuerySchema>

/**
 * TimetableConflictCheck Schema
 */
export const TimetableConflictCheckSchema = z.object({
  roomName: z.string(),
  buildingName: z.string().optional(),
  dayOfWeek: z.enum(DayOfWeek),
  timeSlot: z.string(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  excludeId: z.uuid().optional()
})
export type TimetableConflictCheckDto = z.infer<typeof TimetableConflictCheckSchema>

/**
 * TimetableUploadData Schema
 */
export const TimetableUploadDataSchema = z.object({
  order: z.number().int().min(1),
  courseCode: z.string().min(1),
  credits: z.number().int().min(1),
  studentCount: z.number().int().min(0),
  theoryHours: z.number().int().min(0),
  crowdClassCoefficient: z.number(),
  actualHours: z.number(),
  overtimeCoefficient: z.number(),
  standardHours: z.number(),
  className: z.string(),
  classType: z.string(),
  detailTimeSlots: z.array(DetailTimeSlotsSchema).nonempty(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  lecturerName: z.string()
})
export type TimetableUploadDataDto = z.infer<typeof TimetableUploadDataSchema>

/**
 * TimetableUpload Schema
 */
export const TimetableUploadSchema = z.object({
  data: z.array(TimetableUploadDataSchema)
})
export type TimetableUploadDto = z.infer<typeof TimetableUploadSchema>

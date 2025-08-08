import { z } from 'zod'
import { KyHoc } from '../lib/enum'
import { BaseEntityDTO, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateCourseSchema = z
  .object({
    courseCode: z.string().min(1, 'Mã học phần không được để trống').max(50, 'Mã học phần không được quá 50 ký tự'),
    courseName: z.string().min(1, 'Tên học phần không được để trống').max(255, 'Tên học phần không được quá 255 ký tự'),
    credits: z.number().min(1, 'Số tín chỉ phải lớn hơn 0').max(10, 'Số tín chỉ không được quá 10'),
    semester: z.enum(KyHoc, { message: 'Kỳ học không hợp lệ' }).optional(),
    description: z.string().optional(),
    facultyDepartmentId: z.string().min(1, 'ID khoa không hợp lệ'),
    subjectId: z.string().optional()
  })
  .strict()
  .strip()

export const UpdateCourseSchema = CreateCourseSchema.partial()

export const CourseSchema = BaseEntityDTO.extend({
  courseCode: z.string(),
  courseName: z.string(),
  credits: z.coerce.number().min(1, 'Số tín chỉ phải lớn hơn 0'),
  semester: z.enum(KyHoc),
  description: z.string().nullable(),
  facultyDepartment: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable()
    })
    .nullable()
    .default(null),
  subject: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable()
    })
    .nullable()
    .default(null)
}).strip()

export const CourseResponseSchema = CourseSchema

export const PaginationCourseSchema = createPaginationQuerySchema()

export const CourseQuerySchema = PaginationCourseSchema.extend({
  search: z.string().optional(),
  facultyDepartmentId: z.string().optional(),
  subjectId: z.string().optional(),
  semester: z.enum(KyHoc).optional()
})

export const PaginatedCourseSchema = z
  .object({
    data: z.array(CourseSchema),
    meta: MetaPagination
  })
  .strip()

export const CoursesResponseSchema = z
  .object({
    data: z.array(CourseSchema),
    meta: MetaPagination
  })
  .strip()

export const DeleteCourseSchema = z
  .object({
    id: z.string().min(1, 'ID học phần không hợp lệ')
  })
  .strip()

export const RestoreCourseSchema = z
  .object({
    data: z.object({
      id: z.string().min(1, 'ID học phần không hợp lệ')
    })
  })
  .strip()

export type Course = z.infer<typeof CourseSchema>
export type Courses = z.infer<typeof PaginatedCourseSchema>
export type CourseResponse = z.infer<typeof CourseResponseSchema>
export type CoursesResponse = z.infer<typeof CoursesResponseSchema>
export type PaginationCourse = z.infer<typeof PaginationCourseSchema>
export type PaginatedCourse = z.infer<typeof PaginatedCourseSchema>
export type CreateCourse = z.infer<typeof CreateCourseSchema>
export type UpdateCourse = z.infer<typeof UpdateCourseSchema>
export type CourseQuery = z.infer<typeof CourseQuerySchema>

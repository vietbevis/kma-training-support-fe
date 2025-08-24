import { z } from 'zod'
import { Gender } from '../lib/enum'
import { BaseEntityDTO, createPaginationQuerySchema, FileSchema, MetaPagination } from './CommonSchema'

export const CreateVisitingLecturerSchema = z
  .object({
    fullName: z.string().min(1, 'Họ và tên không được để trống').max(255, 'Họ và tên không được quá 255 ký tự'),
    code: z
      .string()
      .min(1, 'Mã giảng viên mời không được để trống')
      .max(255, 'Mã giảng viên mời không được quá 255 ký tự'),
    gender: z.enum(Gender, { message: 'Giới tính không hợp lệ' }).optional(),
    dateOfBirth: z.coerce.date().optional(),
    phone: z.string().max(20, 'Số điện thoại không được quá 20 ký tự').optional(),
    email: z.string().optional(),
    workPlace: z.string().max(255, 'Nơi công tác không được quá 255 ký tự').optional(),
    citizenId: z.string().max(50, 'Căn cước công dân không được quá 50 ký tự').optional(),
    citizenIdIssueDate: z.coerce.date().optional(),
    citizenIdIssuePlace: z.string().max(255, 'Nơi cấp CCCD không được quá 255 ký tự').optional(),
    citizenIdFront: FileSchema.nullable().optional(),
    citizenIdBack: FileSchema.nullable().optional(),
    highestDegree: FileSchema.nullable().optional(),
    qrCode: FileSchema.nullable().optional(),
    citizenIdAddress: z.string().optional(),
    currentAddress: z.string().optional(),
    areTeaching: z.coerce.boolean(),
    salaryCoefficient: z.coerce.number().min(0, 'Hệ số lương phải lớn hơn hoặc bằng 0').optional(),
    salary: z.coerce.number().min(0, 'Mức lương phải lớn hơn hoặc bằng 0').optional(),
    position: z.string().optional(),
    bankAccount: z.string().max(50, 'Số tài khoản không được quá 50 ký tự').optional(),
    bankName: z.string().max(255, 'Tên ngân hàng không được quá 255 ký tự').optional(),
    bankBranch: z.string().max(255, 'Chi nhánh không được quá 255 ký tự').optional(),
    taxCode: z.string().max(20, 'Mã số thuế không được quá 20 ký tự').optional(),
    exemptionPercentageId: z.string().min(1, 'Phần trăm miễn giảm không được để trống'),
    subjectId: z.string().optional(),
    academicCredentialId: z.string().min(1, 'Học hàm/học vị không được để trống'),
    facultyDepartmentId: z.string().min(1, 'Khoa/phòng ban không được để trống'),
    profileFile: FileSchema.nullable().optional(),
    notes: z.string().optional()
  })
  .strict()
  .strip()

export const UpdateVisitingLecturerSchema = CreateVisitingLecturerSchema

export const VisitingLecturerSchema = BaseEntityDTO.extend({
  code: z.string(),
  fullName: z.string(),
  gender: z.enum(Gender),
  dateOfBirth: z.coerce.date().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  citizenIdFront: FileSchema.nullable().optional(),
  citizenIdBack: FileSchema.nullable().optional(),
  citizenId: z.string().nullable(),
  citizenIdIssueDate: z.coerce.date().nullable(),
  citizenIdIssuePlace: z.string().nullable(),
  citizenIdAddress: z.string().nullable(),
  currentAddress: z.string().nullable(),
  workPlace: z.string().nullable(),
  taxCode: z.string().nullable(),
  bankAccount: z.string().nullable(),
  bankName: z.string().nullable(),
  bankBranch: z.string().nullable(),
  salaryCoefficient: z.coerce.number().nullable(),
  salary: z.coerce.number().nullable(),
  profileFile: FileSchema.nullable().optional(),
  highestDegree: FileSchema.nullable().optional(),
  qrCode: FileSchema.nullable().optional(),
  areTeaching: z.boolean(),
  position: z.string().nullable(),
  trainingApproved: z.boolean(),
  facultyApproved: z.boolean(),
  academyApproved: z.boolean(),
  notes: z.string().nullable(),
  facultyDepartment: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      isFaculty: z.coerce.boolean()
    })
    .nullable()
    .default(null),
  exemptionPercentage: z
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
    .default(null),
  academicCredential: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable()
    })
    .nullable()
    .default(null)
}).strip()

export const VisitingLecturerResponseSchema = VisitingLecturerSchema

export const PaginationVisitingLecturerSchema = createPaginationQuerySchema()

export const VisitingLecturerQuerySchema = PaginationVisitingLecturerSchema.extend({
  search: z.string().optional(),
  facultyDepartmentId: z.string().optional(),
  subjectId: z.string().optional(),
  academicCredentialId: z.string().optional(),
  gender: z.string().optional(),
  areTeaching: z.boolean().optional(),
  trainingApproved: z.boolean().optional(),
  facultyApproved: z.boolean().optional(),
  academyApproved: z.boolean().optional()
})

export const PaginatedVisitingLecturerSchema = z
  .object({
    data: z.array(VisitingLecturerSchema),
    meta: MetaPagination
  })
  .strip()

export const VisitingLecturersResponseSchema = PaginatedVisitingLecturerSchema

export const DeleteVisitingLecturerSchema = z
  .object({
    id: z.number().min(1, 'ID giảng viên mời không hợp lệ')
  })
  .strip()

export const ApproveVisitingLecturerSchema = z
  .object({
    notes: z.string().optional()
  })
  .strip()

export const RejectVisitingLecturerSchema = z
  .object({
    notes: z.string().min(1, 'Ghi chú từ chối không được để trống')
  })
  .strip()

export type VisitingLecturer = z.infer<typeof VisitingLecturerSchema>
export type VisitingLecturers = z.infer<typeof PaginatedVisitingLecturerSchema>
export type VisitingLecturerResponse = z.infer<typeof VisitingLecturerResponseSchema>
export type VisitingLecturersResponse = z.infer<typeof VisitingLecturersResponseSchema>
export type PaginationVisitingLecturer = z.infer<typeof PaginationVisitingLecturerSchema>
export type PaginatedVisitingLecturer = z.infer<typeof PaginatedVisitingLecturerSchema>
export type CreateVisitingLecturer = z.infer<typeof CreateVisitingLecturerSchema>
export type UpdateVisitingLecturer = z.infer<typeof UpdateVisitingLecturerSchema>
export type VisitingLecturerQuery = z.infer<typeof VisitingLecturerQuerySchema>
export type ApproveVisitingLecturer = z.infer<typeof ApproveVisitingLecturerSchema>
export type RejectVisitingLecturer = z.infer<typeof RejectVisitingLecturerSchema>

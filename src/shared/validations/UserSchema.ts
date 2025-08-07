import { z } from 'zod'
import { Gender } from '../lib/enum'
import { BaseEntityDTO, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateUserSchema = z
  .object({
    fullName: z.string().min(1, 'Họ và tên không được để trống').max(255, 'Họ và tên không được quá 255 ký tự'),
    username: z.string().min(1, 'Tên đăng nhập không được để trống').max(255, 'Tên đăng nhập không được quá 255 ký tự'),
    code: z.string().min(1, 'Mã nhân viên không được để trống').max(255, 'Mã nhân viên không được quá 255 ký tự'),
    password: z.string().min(1, 'Mật khẩu không được để trống').max(255, 'Mật khẩu không được quá 255 ký tự'),
    gender: z.enum(Gender, { message: 'Giới tính không hợp lệ' }),
    dateOfBirth: z.string(),
    phone: z.string().max(20, 'Số điện thoại không được quá 20 ký tự'),
    email: z.string().email('Email không hợp lệ').max(255, 'Email không được quá 255 ký tự'),
    workplace: z.string().max(255, 'Nơi công tác không được quá 255 ký tự'),
    citizenId: z.string().max(50, 'Căn cước công dân không được quá 50 ký tự'),
    citizenIdIssueDate: z.string(),
    citizenIdIssuePlace: z.string().max(255, 'Nơi cấp CCCD không được quá 255 ký tự'),
    citizenIdFront: z.string().max(500, 'Đường dẫn file ảnh CCCD không được quá 500 ký tự'),
    citizenIdBack: z.string().max(500, 'Đường dẫn file ảnh CCCD không được quá 500 ký tự'),
    citizenIdAddress: z.string(),
    currentAddress: z.string(),
    areTeaching: z.coerce.boolean(),
    salaryCoefficient: z.coerce.number().min(0, 'Hệ số lương phải lớn hơn hoặc bằng 0'),
    salary: z.coerce.number().min(0, 'Mức lương phải lớn hơn hoặc bằng 0'),
    position: z.string(),
    bankAccount: z.string().max(50, 'Số tài khoản không được quá 50 ký tự'),
    bankName: z.string().max(255, 'Tên ngân hàng không được quá 255 ký tự'),
    bankBranch: z.string().max(255, 'Chi nhánh không được quá 255 ký tự'),
    taxCode: z.string().max(20, 'Mã số thuế không được quá 20 ký tự'),
    exemptionPercentageId: z.string(),
    subjectId: z.string(),
    academicCredentialId: z.string(),
    facultyDepartmentId: z.string(),
    roleIds: z.array(z.string()),
    profileFile: z.string().max(500, 'Đường dẫn file lý lịch không được quá 500 ký tự')
  })
  .strict()
  .strip()

export const UpdateUserSchema = CreateUserSchema

export const UserSchema = BaseEntityDTO.extend({
  code: z.string(),
  fullName: z.string(),
  username: z.string(),
  gender: z.enum(Gender),
  dateOfBirth: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  citizenIdFront: z.string().nullable(),
  citizenIdBack: z.string().nullable(),
  citizenId: z.string().nullable(),
  citizenIdIssueDate: z.string().nullable(),
  citizenIdIssuePlace: z.string().nullable(),
  citizenIdAddress: z.string().nullable(),
  currentAddress: z.string().nullable(),
  workplace: z.string().nullable(),
  taxCode: z.string().nullable(),
  bankAccount: z.string().nullable(),
  bankName: z.string().nullable(),
  bankBranch: z.string().nullable(),
  salaryCoefficient: z.coerce.number().nullable(),
  salary: z.coerce.number().nullable(),
  profileFile: z.string().nullable(),
  areTeaching: z.boolean(),
  position: z.string().nullable(),
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
    .default(null),
  roles: z.array(z.object({ id: z.string(), name: z.string() }))
}).strip()

export const UserResponseSchema = UserSchema

export const PaginationUserSchema = createPaginationQuerySchema()

export const UserQuerySchema = PaginationUserSchema.extend({
  search: z.string().optional(),
  facultyDepartmentId: z.string().optional(),
  subjectId: z.string().optional(),
  academicCredentialId: z.string().optional(),
  gender: z.string().optional(),
  areTeaching: z.boolean().optional()
})

export const PaginatedUserSchema = z
  .object({
    data: z.array(UserSchema),
    meta: MetaPagination
  })
  .strip()

export const UsersResponseSchema = PaginatedUserSchema

export const DeleteUserSchema = z
  .object({
    id: z.number().min(1, 'ID nhân viên không hợp lệ')
  })
  .strip()

export const RestoreUserSchema = z
  .object({
    id: z.number().min(1, 'ID nhân viên không hợp lệ')
  })
  .strip()

export type User = z.infer<typeof UserSchema>
export type Users = z.infer<typeof PaginatedUserSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>
export type UsersResponse = z.infer<typeof UsersResponseSchema>
export type PaginationUser = z.infer<typeof PaginationUserSchema>
export type PaginatedUser = z.infer<typeof PaginatedUserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
export type UserQuery = z.infer<typeof UserQuerySchema>

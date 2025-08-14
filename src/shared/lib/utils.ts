import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: any, defaultMessage = 'Lỗi không xác định.') {
  return (error as any).response?.data.message || defaultMessage
}

export function normalizeObject<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) return obj

  if (Array.isArray(obj)) {
    return obj
      .map((item) => normalizeObject(item))
      .filter((value) => value !== null && value !== undefined && value !== '' && value !== 'null') as T
  }

  return Object.fromEntries(
    Object.entries(obj as Record<string, unknown>)
      .map(([key, value]) => [key, normalizeObject(value)])
      .filter(([, value]) => value !== null && value !== undefined && value !== '' && value !== 'null')
  ) as T
}

export const translateModule = (module: string) => {
  switch (module) {
    case 'AcademicCredentialModule':
      return 'Quản lý học hàm học vị'
    case 'AcademicYearsModule':
      return 'Quản lý năm học'
    case 'AccountModule':
      return 'Quản lý tài khoản'
    case 'AppModule':
      return 'Quản lý ứng dụng'
    case 'AuthModule':
      return 'Quản lý quyền truy cập'
    case 'BuildingModule':
      return 'Quản lý tòa nhà'
    case 'ClassroomModule':
      return 'Quản lý phòng học'
    case 'CourseModule':
      return 'Quản lý học phần'
    case 'EducationalSystemModule':
      return 'Quản lý hệ đào tạo'
    case 'ExemptionPercentageModule':
      return 'Quản lý phần trăm miễn giảm'
    case 'FacultyDepartmentModule':
      return 'Quản lý khoa/phòng ban'
    case 'FilesModule':
      return 'Quản lý tài liệu'
    case 'LectureInvitationMoneyModule':
      return 'Quản lý tiền mời giảng'
    case 'PermissionModule':
      return 'Quản lý quyền'
    case 'RoleModule':
      return 'Quản lý vai trò'
    case 'StandardLectureHoursModule':
      return 'Quản lý số tiết định mức'
    case 'SubjectModule':
      return 'Quản lý bộ môn'
    case 'UserModule':
      return 'Quản lý người dùng'
    default:
      return module
  }
}

export const getMethodBadgeVariant = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'secondary'
    case 'POST':
      return 'default'
    case 'PUT':
      return 'outline'
    case 'DELETE':
      return 'destructive'
    default:
      return 'secondary'
  }
}

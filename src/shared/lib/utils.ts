import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import ROUTES from './routes'

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
      return 'Quản lý nhân viên'
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

export const entityNameToEditPath = (entityName: string) => {
  switch (entityName) {
    case 'UserEntity':
      return ROUTES.USER_EDIT.getPath
    case 'RoleEntity':
      return ROUTES.ROLE_EDIT.getPath
    case 'PermissionEntity':
      return ROUTES.PERMISSIONS.url
    case 'AcademicYearEntity':
      return ROUTES.ACADEMIC_YEARS.url
    case 'AcademicCredentialsEntity':
      return ROUTES.ACADEMIC_CREDENTIALS.url
    case 'BuildingEntity':
      return ROUTES.BUILDINGS.url
    case 'ClassroomEntity':
      return ROUTES.CLASSROOMS.url
    case 'CourseEntity':
      return ROUTES.COURSES.url
    case 'EducationalSystemEntity':
      return ROUTES.EDUCATIONAL_SYSTEMS.url
    case 'ExemptionPercentageEntity':
      return ROUTES.EXEMPTION_PERCENTAGES.url
    case 'FacultyDepartmentEntity':
      return ROUTES.FACULTY_DEPARTMENTS.url
    case 'LectureInvitationMoneyEntity':
      return ROUTES.LECTURE_INVITATION_MONEYS.url
    case 'SubjectEntity':
      return ROUTES.SUBJECTS.url
    case 'AccountEntity':
      return ROUTES.ACCOUNTS.url
    case 'AuditLogEntity':
      return ROUTES.AUDIT_LOGS.url
    default:
      return ''
  }
}

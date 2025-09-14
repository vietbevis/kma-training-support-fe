import type { PermissionRequirement } from '@/shared/lib/utils'

// Permission constants cho các actions trong hệ thống
export const PERMISSIONS = {
  // Users
  USERS: {
    LIST: { method: 'GET', path: '/users' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/users' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/users/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/users/:id/hard' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/users/:id' } as PermissionRequirement
  },

  // Roles
  ROLES: {
    LIST: { method: 'GET', path: '/roles' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/roles' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/roles/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/roles/:id' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/roles/:id' } as PermissionRequirement
  },

  // Permissions
  PERMISSIONS: {
    LIST: { method: 'GET', path: '/permissions' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/permissions/:id' } as PermissionRequirement
  },

  // Accounts
  ACCOUNTS: {
    LIST: { method: 'GET', path: '/accounts' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/accounts' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/accounts/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/accounts/:id/hard' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/accounts/:id' } as PermissionRequirement
  },

  // Academic Years
  ACADEMIC_YEARS: {
    LIST: { method: 'GET', path: '/academic-years' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/academic-years' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/academic-years/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/academic-years/:id/hard' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/academic-years/:id' } as PermissionRequirement
  },

  // Buildings
  BUILDINGS: {
    LIST: { method: 'GET', path: '/buildings' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/buildings' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/buildings/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/buildings/:id/hard' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/buildings/:id' } as PermissionRequirement
  },

  // Classrooms
  CLASSROOMS: {
    LIST: { method: 'GET', path: '/classrooms' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/classrooms' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/classrooms/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/classrooms/:id/hard' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/classrooms/:id' } as PermissionRequirement,
    CLASSROOM_AVAILABILITY: { method: 'GET', path: '/classrooms/availability' } as PermissionRequirement
  },

  // Academic Credentials
  ACADEMIC_CREDENTIALS: {
    LIST: { method: 'GET', path: '/academic-credentials' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/academic-credentials' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/academic-credentials/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/academic-credentials/:id/hard' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/academic-credentials/:id' } as PermissionRequirement
  },

  // Educational Systems
  EDUCATIONAL_SYSTEMS: {
    LIST: { method: 'GET', path: '/educational-systems' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/educational-systems' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/educational-systems/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/educational-systems/:id/hard' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/educational-systems/:id' } as PermissionRequirement
  },

  // Faculty Departments
  FACULTY_DEPARTMENTS: {
    LIST: { method: 'GET', path: '/faculty-departments' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/faculty-departments' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/faculty-departments/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/faculty-departments/:id/hard' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/faculty-departments/:id' } as PermissionRequirement,
    MERGE: { method: 'POST', path: '/faculty-departments/merge' } as PermissionRequirement
  },

  // Subjects
  SUBJECTS: {
    LIST: { method: 'GET', path: '/subjects' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/subjects' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/subjects/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/subjects/:id/hard' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/subjects/:id' } as PermissionRequirement
  },

  // Courses
  COURSES: {
    LIST: { method: 'GET', path: '/courses' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/courses' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/courses/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/courses/:id/hard' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/courses/:id' } as PermissionRequirement
  },

  // Exemption Percentages
  EXEMPTION_PERCENTAGES: {
    LIST: { method: 'GET', path: '/exemption-percentages' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/exemption-percentages' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/exemption-percentages/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/exemption-percentages/:id/hard' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/exemption-percentages/:id' } as PermissionRequirement
  },

  // Lecture Invitation Money
  LECTURE_INVITATION_MONEY: {
    LIST: { method: 'GET', path: '/lecture-invitation-money' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/lecture-invitation-money' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/lecture-invitation-money/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/lecture-invitation-money/:id/hard' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/lecture-invitation-money/:id' } as PermissionRequirement
  },

  // Audit Logs
  AUDIT_LOGS: {
    LIST: { method: 'GET', path: '/audit-logs' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/audit-logs/:id' } as PermissionRequirement
  },

  // Visiting Lecturers
  VISITING_LECTURERS: {
    LIST: { method: 'GET', path: '/visiting-lecturers' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/visiting-lecturers' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/visiting-lecturers/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/visiting-lecturers/:id/hard' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/visiting-lecturers/:id' } as PermissionRequirement,
    TRAINING_APPROVE: { method: 'POST', path: '/visiting-lecturers/:id/training-approve' } as PermissionRequirement,
    TRAINING_REJECT_FACULTY: {
      method: 'POST',
      path: '/visiting-lecturers/:id/training-reject-faculty'
    } as PermissionRequirement,
    FACULTY_APPROVE: { method: 'POST', path: '/visiting-lecturers/:id/faculty-approve' } as PermissionRequirement,
    ACADEMY_APPROVE: { method: 'POST', path: '/visiting-lecturers/:id/academy-approve' } as PermissionRequirement,
    ACADEMY_REJECT: { method: 'POST', path: '/visiting-lecturers/:id/academy-reject' } as PermissionRequirement,
    ACADEMY_REJECT_TRAINING: {
      method: 'POST',
      path: '/visiting-lecturers/:id/academy-reject-training'
    } as PermissionRequirement
  },

  // Timetables
  TIMETABLES: {
    LIST: { method: 'GET', path: '/timetables' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/timetables' } as PermissionRequirement,
    UPDATE: { method: 'PATCH', path: '/timetables/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/timetables/:id' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/timetables/:id' } as PermissionRequirement,
    UPLOAD_EXCEL: { method: 'POST', path: '/timetables/upload-excel' } as PermissionRequirement
  },

  // Backups
  BACKUPS: {
    VIEW: { method: 'GET', path: '/backup/:id' } as PermissionRequirement,
    LIST: { method: 'GET', path: '/backup' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/backup' } as PermissionRequirement,
    DOWNLOAD: { method: 'GET', path: '/backup/:id/download' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/backup/:id' } as PermissionRequirement,
    RESTORE: { method: 'POST', path: '/backup/:id/restore' } as PermissionRequirement,
    RESTORE_FROM_UPLOAD: { method: 'POST', path: '/backup/restore-from-upload' } as PermissionRequirement,
    CLEANUP: { method: 'POST', path: '/backup/cleanup' } as PermissionRequirement,
    REBUILD_METADATA: { method: 'POST', path: '/backup/rebuild-metadata' } as PermissionRequirement
  }
} as const

// Helper để tạo permission variations cho các paths với parameters
export const createPermissionForPath = (
  basePermission: PermissionRequirement,
  pathParams?: Record<string, string>
): PermissionRequirement => {
  if (!pathParams) return basePermission

  let path = basePermission.path
  Object.entries(pathParams).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value)
  })

  return {
    ...basePermission,
    path
  }
}

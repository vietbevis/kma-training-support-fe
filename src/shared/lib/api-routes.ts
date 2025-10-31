const API_ROUTES = {
  AUTH: {
    LOGIN: '/v1/auth/login',
    REFRESH_TOKEN: '/v1/auth/refresh-token',
    LOGOUT: '/v1/auth/logout'
  },
  ACADEMIC_YEARS: '/v1/academic-years',
  FACULTIES: {
    ROOT: '/v1/faculties',
    MERGE: '/v1/faculties/merge'
  },
  FACULTY_DEPARTMENTS: '/v1/faculty-departments',
  USERS: '/v1/users',
  ATTACHMENTS: '/v1/attachments',
  TAX_EXEMPTIONS: '/v1/tax-exemptions',
  POSITIONS: '/v1/positions',
  BUILDINGS: '/v1/buildings',
  CLASSROOMS: '/v1/classrooms',
  CLASSROOM_TIMESLOTS: '/v1/timeslots',
  CLASSROOM_AVAILABILITY: '/v1/classrooms/availability',
  ACCOUNTS: '/v1/accounts',
  ACADEMIC_CREDENTIALS: '/v1/academic-credentials',
  EDUCATIONAL_SYSTEMS: '/v1/educational-systems',
  LECTURE_INVITATION_MONEYS: '/v1/lecture-invitation-money',
  COURSES: '/v1/courses',
  SUBJECTS: '/v1/subjects',
  EXEMPTION_PERCENTAGES: '/v1/exemption-percentages',
  UPLOAD_FILES: '/v1/files/upload',
  PERMISSIONS: '/v1/permissions',
  ROLES: '/v1/roles',
  AUDIT_LOGS: '/v1/audit-logs',
  VISITING_LECTURERS: '/v1/visiting-lecturers',
  TIMETABLES: '/v1/timetables',
  STANDARDS: '/v1/standards',
  BACKUPS: {
    ROOT: '/v1/backup',
    RESTORE: (id: string) => `/v1/backup/${id}/restore`,
    DOWNLOAD: (id: string) => `/v1/backup/${id}/download`,
    RESTORE_FROM_UPLOAD: '/v1/backup/restore-from-upload',
    STATISTICS: '/v1/backup/statistics',
    CLEANUP: '/v1/backup/cleanup',
    REBUILD_METADATA: '/v1/backup/rebuild-metadata'
  }
}

export default API_ROUTES

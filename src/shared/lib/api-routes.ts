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
  ACCOUNTS: '/v1/accounts',
  ACADEMIC_CREDENTIALS: '/v1/academic-credentials',
  SUBJECTS: '/v1/subjects'
}

export default API_ROUTES

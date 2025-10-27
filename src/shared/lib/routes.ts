import {
  BookOpen,
  Building,
  Calendar,
  ClipboardList,
  Database,
  GraduationCap,
  Home,
  LogIn,
  Pencil,
  Percent,
  School,
  School2,
  Search,
  Shield,
  SquareTerminal,
  User,
  UserCheck,
  UserPlus
} from 'lucide-react'

const ROUTES = {
  HOME: {
    title: 'Trang chủ',
    url: '/',
    icon: Home
  },
  ACCOUNTS: {
    title: 'Tài khoản',
    url: '/accounts',
    icon: SquareTerminal
  },
  LOGIN: {
    title: 'Đăng nhập',
    url: '/login',
    icon: LogIn
  },
  ACADEMIC_YEARS: {
    title: 'Năm học',
    url: '/academic-years',
    icon: BookOpen
  },
  BUILDINGS: {
    title: 'Tòa nhà',
    url: '/buildings',
    icon: Building
  },
  CLASSROOMS: {
    title: 'Phòng học',
    url: '/classrooms',
    icon: School
  },
  ACADEMIC_CREDENTIALS: {
    title: 'Học hàm/học vị',
    url: '/academic-credentials',
    icon: GraduationCap
  },
  EDUCATIONAL_SYSTEMS: {
    title: 'Hệ đào tạo',
    url: '/educational-systems',
    icon: BookOpen
  },
  FACULTY_DEPARTMENTS: {
    title: 'Khoa/Phòng ban',
    url: '/faculty-departments',
    icon: School2
  },
  SUBJECTS: {
    title: 'Bộ môn',
    url: '/subjects',
    icon: BookOpen
  },
  COURSES: {
    title: 'Học phần',
    url: '/courses',
    icon: BookOpen
  },
  EXEMPTION_PERCENTAGES: {
    title: 'Phần trăm miễn giảm',
    url: '/exemption-percentages',
    icon: Percent
  },
  LECTURE_INVITATION_MONEYS: {
    title: 'Tiền mời giảng',
    url: '/lecture-invitation-money',
    icon: BookOpen
  },
  TIMETABLES: {
    title: 'Thời khóa biểu',
    url: '/timetables',
    icon: Calendar
  },
  USER_CREATE: {
    title: 'Thêm nhân viên',
    url: '/users/create',
    icon: UserPlus
  },
  USER_EDIT: {
    title: 'Sửa nhân viên',
    url: `/users/:id/edit`,
    icon: Pencil,
    getPath: (id: string) => `/users/${id}/edit`
  },
  USERS_ACTIVE: {
    title: 'DS nhân viên',
    url: '/users/active',
    icon: UserCheck
  },
  USERS_INACTIVE: {
    title: 'Đã ngừng giảng dạy',
    url: '/users/inactive',
    icon: User
  },
  PERMISSIONS: {
    title: 'Phân quyền',
    url: '/permissions',
    icon: Shield
  },
  ROLES: {
    title: 'Vai trò',
    url: '/roles',
    icon: UserCheck
  },
  ROLE_EDIT: {
    title: 'Sửa vai trò',
    url: '/roles/:id/edit',
    icon: Pencil,
    getPath: (id: string) => `/roles/${id}/edit`
  },
  ROLE_CREATE: {
    title: 'Tạo vai trò',
    url: '/roles/create',
    icon: UserPlus
  },
  AUDIT_LOGS: {
    title: 'Lịch sử hoạt động',
    url: '/audit-logs',
    icon: ClipboardList
  },
  VISITING_LECTURER_CREATE: {
    title: 'Thêm giảng viên mời',
    url: '/visiting-lecturers/create',
    icon: UserPlus
  },
  VISITING_LECTURER_EDIT: {
    title: 'Sửa giảng viên mời',
    url: `/visiting-lecturers/:id/edit`,
    icon: Pencil,
    getPath: (id: string) => `/visiting-lecturers/${id}/edit`
  },
  VISITING_LECTURERS_ACTIVE: {
    title: 'DS giảng viên mời',
    url: '/visiting-lecturers/active',
    icon: UserCheck
  },
  VISITING_LECTURERS_INACTIVE: {
    title: 'Đã ngừng giảng dạy',
    url: '/visiting-lecturers/inactive',
    icon: User
  },
  VISITING_LECTURERS_ACADEMY_APPROVED: {
    title: 'DS giảng viên mời',
    url: '/visiting-lecturers/academy-approved',
    icon: UserCheck
  },
  VISITING_LECTURERS_PENDING: {
    title: 'DS chờ duyệt',
    url: '/visiting-lecturers/pending',
    icon: User
  },
  TIMETABLE_CLASSROOM: {
    title: 'Tình trạng phòng học',
    url: '/timetable-classroom',
    icon: Search
  },
  BACKUPS: {
    title: 'Backup hệ thống',
    url: '/backups',
    icon: Database
  }
}

export default ROUTES

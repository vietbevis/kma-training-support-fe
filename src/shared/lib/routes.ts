import {
  BookOpen,
  Building,
  Calendar,
  ClipboardList,
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
  USERS: {
    title: 'Nhân viên',
    url: '/users',
    icon: User
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
  VISITING_LECTURERS: {
    title: 'Giảng viên mời',
    url: '/visiting-lecturers',
    getPath: (id: string) => `/visiting-lecturers/${id}/edit`,
    icon: User
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
  TIMETABLE_CLASSROOM: {
    title: 'Tình trạng phòng học',
    url: '/timetable-classroom',
    icon: Search
  }
}

export default ROUTES

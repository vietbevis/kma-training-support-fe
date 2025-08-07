import {
  BookOpen,
  Building,
  GraduationCap,
  Home,
  LogIn,
  Pencil,
  Percent,
  School,
  School2,
  SquareTerminal,
  User,
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
  EXEMPTION_PERCENTAGES: {
    title: 'Phần trăm miễn giảm',
    url: '/exemption-percentages',
    icon: Percent
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
    url: '/users/:id/edit',
    icon: Pencil
  }
}

export default ROUTES

import { BookOpen, Building, GraduationCap, Home, LogIn, School, School2, SquareTerminal } from 'lucide-react'

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
  }
}

export default ROUTES

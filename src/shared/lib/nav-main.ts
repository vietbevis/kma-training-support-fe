import {
  BookOpen,
  Building2,
  CalendarDays,
  GraduationCap,
  Notebook,
  Settings,
  UserCog,
  UserPlus,
  Users,
  Wallet
} from 'lucide-react'
import { PERMISSIONS } from '../constants/permissions'
import ROUTES from './routes'

export interface NavItem {
  title: string
  url: string
  icon?: any
  isActive?: boolean
  requiredPermission?: {
    method: string
    path: string
  }
  items?: SubNavItem[]
}

export interface SubNavItem {
  title: string
  url: string
  requiredPermission?: {
    method: string
    path: string
  }
}

const navMain: NavItem[] = [
  {
    title: 'Người dùng',
    url: '#',
    icon: Users,
    isActive: true,
    items: [
      {
        title: ROUTES.ACCOUNTS.title,
        url: ROUTES.ACCOUNTS.url,
        requiredPermission: PERMISSIONS.ACCOUNTS.LIST
      },
      {
        title: ROUTES.PERMISSIONS.title,
        url: ROUTES.PERMISSIONS.url,
        requiredPermission: PERMISSIONS.PERMISSIONS.LIST
      },
      {
        title: ROUTES.ROLES.title,
        url: ROUTES.ROLES.url,
        requiredPermission: PERMISSIONS.ROLES.LIST
      }
    ]
  },
  {
    title: 'Giảng viên mời',
    url: '#',
    icon: UserPlus,
    isActive: true,
    items: [
      {
        title: ROUTES.VISITING_LECTURER_CREATE.title,
        url: ROUTES.VISITING_LECTURER_CREATE.url,
        requiredPermission: PERMISSIONS.VISITING_LECTURERS?.CREATE || { method: 'POST', path: '/visiting-lecturers' }
      },
      {
        title: ROUTES.VISITING_LECTURERS_ACTIVE.title,
        url: ROUTES.VISITING_LECTURERS_ACTIVE.url,
        requiredPermission: PERMISSIONS.VISITING_LECTURERS?.LIST || { method: 'GET', path: '/visiting-lecturers' }
      },
      {
        title: ROUTES.VISITING_LECTURERS_PENDING.title,
        url: ROUTES.VISITING_LECTURERS_PENDING.url,
        requiredPermission: PERMISSIONS.VISITING_LECTURERS?.LIST || { method: 'GET', path: '/visiting-lecturers' }
      },
      {
        title: ROUTES.VISITING_LECTURERS_INACTIVE.title,
        url: ROUTES.VISITING_LECTURERS_INACTIVE.url,
        requiredPermission: PERMISSIONS.VISITING_LECTURERS?.LIST || { method: 'GET', path: '/visiting-lecturers' }
      }
    ]
  },
  {
    title: 'Nhân viên',
    url: '#',
    icon: UserCog,
    isActive: true,
    items: [
      {
        title: ROUTES.USER_CREATE.title,
        url: ROUTES.USER_CREATE.url,
        requiredPermission: PERMISSIONS.USERS.CREATE
      },
      {
        title: ROUTES.USERS_ACTIVE.title,
        url: ROUTES.USERS_ACTIVE.url,
        requiredPermission: PERMISSIONS.USERS.LIST
      },
      {
        title: ROUTES.USERS_INACTIVE.title,
        url: ROUTES.USERS_INACTIVE.url,
        requiredPermission: PERMISSIONS.USERS.LIST
      }
    ]
  },
  {
    title: 'Thời khóa biểu',
    url: '#',
    icon: CalendarDays,
    isActive: true,
    items: [
      {
        title: ROUTES.TIMETABLES.title,
        url: ROUTES.TIMETABLES.url,
        requiredPermission: PERMISSIONS.TIMETABLES.LIST
      },
      {
        title: ROUTES.TIMETABLE_CLASSROOM.title,
        url: ROUTES.TIMETABLE_CLASSROOM.url,
        requiredPermission: PERMISSIONS.CLASSROOMS.CLASSROOM_AVAILABILITY
      }
    ]
  },
  {
    title: ROUTES.EDUCATIONAL_SYSTEMS.title,
    url: ROUTES.EDUCATIONAL_SYSTEMS.url,
    icon: GraduationCap,
    requiredPermission: PERMISSIONS.EDUCATIONAL_SYSTEMS.LIST
  },
  {
    title: ROUTES.LECTURE_INVITATION_MONEYS.title,
    url: ROUTES.LECTURE_INVITATION_MONEYS.url,
    icon: Wallet,
    requiredPermission: PERMISSIONS.LECTURE_INVITATION_MONEY.LIST
  },
  {
    title: ROUTES.FACULTY_DEPARTMENTS.title,
    url: ROUTES.FACULTY_DEPARTMENTS.url,
    icon: Building2,
    requiredPermission: PERMISSIONS.FACULTY_DEPARTMENTS.LIST
  },
  {
    title: ROUTES.SUBJECTS.title,
    url: ROUTES.SUBJECTS.url,
    icon: BookOpen,
    requiredPermission: PERMISSIONS.SUBJECTS.LIST
  },
  {
    title: ROUTES.COURSES.title,
    url: ROUTES.COURSES.url,
    icon: Notebook,
    requiredPermission: PERMISSIONS.COURSES.LIST
  },
  {
    title: 'Hệ thống',
    url: '#',
    icon: Settings,
    isActive: true,
    items: [
      {
        title: ROUTES.ACADEMIC_YEARS.title,
        url: ROUTES.ACADEMIC_YEARS.url,
        requiredPermission: PERMISSIONS.ACADEMIC_YEARS.LIST
      },
      {
        title: ROUTES.CLASSROOMS.title,
        url: ROUTES.CLASSROOMS.url,
        requiredPermission: PERMISSIONS.CLASSROOMS.LIST
      },
      {
        title: ROUTES.BUILDINGS.title,
        url: ROUTES.BUILDINGS.url,
        requiredPermission: PERMISSIONS.BUILDINGS.LIST
      },
      {
        title: ROUTES.ACADEMIC_CREDENTIALS.title,
        url: ROUTES.ACADEMIC_CREDENTIALS.url,
        requiredPermission: PERMISSIONS.ACADEMIC_CREDENTIALS.LIST
      },
      {
        title: ROUTES.EXEMPTION_PERCENTAGES.title,
        url: ROUTES.EXEMPTION_PERCENTAGES.url,
        requiredPermission: PERMISSIONS.EXEMPTION_PERCENTAGES.LIST
      },
      {
        title: ROUTES.AUDIT_LOGS.title,
        url: ROUTES.AUDIT_LOGS.url,
        requiredPermission: PERMISSIONS.AUDIT_LOGS.LIST
      },
      {
        title: ROUTES.BACKUPS.title,
        url: ROUTES.BACKUPS.url,
        requiredPermission: PERMISSIONS.BACKUPS.LIST
      }
    ]
  }
]

export default navMain

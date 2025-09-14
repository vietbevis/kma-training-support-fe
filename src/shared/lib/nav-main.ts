import { BookOpen, Bot, Calendar, Settings2, SquareTerminal } from 'lucide-react'
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
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: ROUTES.ACCOUNTS.title,
        url: ROUTES.ACCOUNTS.url,
        requiredPermission: PERMISSIONS.ACCOUNTS.LIST
      },
      {
        title: ROUTES.USERS.title,
        url: ROUTES.USERS.url,
        requiredPermission: PERMISSIONS.USERS.LIST
      },
      {
        title: ROUTES.VISITING_LECTURERS.title,
        url: ROUTES.VISITING_LECTURERS.url,
        requiredPermission: PERMISSIONS.VISITING_LECTURERS.LIST
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
    title: 'Thời khóa biểu',
    url: '#',
    icon: Calendar,
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
    icon: Bot,
    requiredPermission: PERMISSIONS.EDUCATIONAL_SYSTEMS.LIST
  },
  {
    title: ROUTES.LECTURE_INVITATION_MONEYS.title,
    url: ROUTES.LECTURE_INVITATION_MONEYS.url,
    icon: Bot,
    requiredPermission: PERMISSIONS.LECTURE_INVITATION_MONEY.LIST
  },
  {
    title: ROUTES.FACULTY_DEPARTMENTS.title,
    url: ROUTES.FACULTY_DEPARTMENTS.url,
    icon: BookOpen,
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
    icon: BookOpen,
    requiredPermission: PERMISSIONS.COURSES.LIST
  },
  {
    title: 'Hệ thống',
    url: '#',
    icon: Settings2,
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

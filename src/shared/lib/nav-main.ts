import { BookOpen, Bot, Calendar, Settings2, SquareTerminal } from 'lucide-react'
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
        requiredPermission: {
          method: 'GET',
          path: '/accounts'
        }
      },
      {
        title: ROUTES.USERS.title,
        url: ROUTES.USERS.url,
        requiredPermission: {
          method: 'GET',
          path: '/users'
        }
      },
      {
        title: ROUTES.VISITING_LECTURERS.title,
        url: ROUTES.VISITING_LECTURERS.url,
        requiredPermission: {
          method: 'GET',
          path: '/visiting-lecturers'
        }
      },
      {
        title: ROUTES.PERMISSIONS.title,
        url: ROUTES.PERMISSIONS.url,
        requiredPermission: {
          method: 'GET',
          path: '/permissions'
        }
      },
      {
        title: ROUTES.ROLES.title,
        url: ROUTES.ROLES.url,
        requiredPermission: {
          method: 'GET',
          path: '/roles'
        }
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
        requiredPermission: {
          method: 'GET',
          path: '/timetables'
        }
      },
      {
        title: ROUTES.TIMETABLE_CLASSROOM.title,
        url: ROUTES.TIMETABLE_CLASSROOM.url
        // requiredPermission: {
        //   method: 'GET',
        //   path: '/classrooms/availability'
        // }
      }
    ]
  },
  {
    title: ROUTES.EDUCATIONAL_SYSTEMS.title,
    url: ROUTES.EDUCATIONAL_SYSTEMS.url,
    icon: Bot,
    requiredPermission: {
      method: 'GET',
      path: '/educational-systems'
    }
  },
  {
    title: ROUTES.LECTURE_INVITATION_MONEYS.title,
    url: ROUTES.LECTURE_INVITATION_MONEYS.url,
    icon: Bot,
    requiredPermission: {
      method: 'GET',
      path: '/lecture-invitation-money'
    }
  },
  {
    title: ROUTES.FACULTY_DEPARTMENTS.title,
    url: ROUTES.FACULTY_DEPARTMENTS.url,
    icon: BookOpen,
    requiredPermission: {
      method: 'GET',
      path: '/faculty-departments'
    }
  },
  {
    title: ROUTES.SUBJECTS.title,
    url: ROUTES.SUBJECTS.url,
    icon: BookOpen,
    requiredPermission: {
      method: 'GET',
      path: '/subjects'
    }
  },
  {
    title: ROUTES.COURSES.title,
    url: ROUTES.COURSES.url,
    icon: BookOpen,
    requiredPermission: {
      method: 'GET',
      path: '/courses'
    }
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
        requiredPermission: {
          method: 'GET',
          path: '/academic-years'
        }
      },
      {
        title: ROUTES.CLASSROOMS.title,
        url: ROUTES.CLASSROOMS.url,
        requiredPermission: {
          method: 'GET',
          path: '/classrooms'
        }
      },
      {
        title: ROUTES.BUILDINGS.title,
        url: ROUTES.BUILDINGS.url,
        requiredPermission: {
          method: 'GET',
          path: '/buildings'
        }
      },
      {
        title: ROUTES.ACADEMIC_CREDENTIALS.title,
        url: ROUTES.ACADEMIC_CREDENTIALS.url,
        requiredPermission: {
          method: 'GET',
          path: '/academic-credentials'
        }
      },
      {
        title: ROUTES.EXEMPTION_PERCENTAGES.title,
        url: ROUTES.EXEMPTION_PERCENTAGES.url,
        requiredPermission: {
          method: 'GET',
          path: '/exemption-percentages'
        }
      },
      {
        title: ROUTES.AUDIT_LOGS.title,
        url: ROUTES.AUDIT_LOGS.url,
        requiredPermission: {
          method: 'GET',
          path: '/audit-logs'
        }
      }
    ]
  }
]

export default navMain

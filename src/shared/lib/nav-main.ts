import { BookOpen, Bot, Settings2, SquareTerminal } from 'lucide-react'
import ROUTES from './routes'

const navMain = [
  {
    title: 'Người dùng',
    url: '#',
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: ROUTES.ACCOUNTS.title,
        url: ROUTES.ACCOUNTS.url
      },
      {
        title: ROUTES.USERS.title,
        url: ROUTES.USERS.url
      }
    ]
  },
  {
    title: ROUTES.EDUCATIONAL_SYSTEMS.title,
    url: ROUTES.EDUCATIONAL_SYSTEMS.url,
    icon: Bot
  },
  {
    title: ROUTES.LECTURE_INVITATION_MONEYS.title,
    url: ROUTES.LECTURE_INVITATION_MONEYS.url,
    icon: Bot
  },
  {
    title: ROUTES.FACULTY_DEPARTMENTS.title,
    url: ROUTES.FACULTY_DEPARTMENTS.url,
    icon: BookOpen
  },
  {
    title: ROUTES.SUBJECTS.title,
    url: ROUTES.SUBJECTS.url,
    icon: BookOpen
  },
  {
    title: ROUTES.COURSES.title,
    url: ROUTES.COURSES.url,
    icon: BookOpen
  },
  {
    title: 'Hệ thống',
    url: '#',
    icon: Settings2,
    isActive: true,
    items: [
      {
        title: ROUTES.ACADEMIC_YEARS.title,
        url: ROUTES.ACADEMIC_YEARS.url
      },
      {
        title: ROUTES.CLASSROOMS.title,
        url: ROUTES.CLASSROOMS.url
      },
      {
        title: ROUTES.BUILDINGS.title,
        url: ROUTES.BUILDINGS.url
      },
      {
        title: ROUTES.ACADEMIC_CREDENTIALS.title,
        url: ROUTES.ACADEMIC_CREDENTIALS.url
      },
      {
        title: ROUTES.EXEMPTION_PERCENTAGES.title,
        url: ROUTES.EXEMPTION_PERCENTAGES.url
      },
      {
        title: 'Số tiết định mức',
        url: '#'
      }
    ]
  }
]

export default navMain

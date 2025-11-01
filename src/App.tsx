import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { AuthGuard } from './features/auth'
import { authLoader } from './features/auth/api/AuthLoader'
import GlobalLoadingPrivider from './shared/components/GlobalLoadingPrivider'
import { ReactQueryProvider } from './shared/components/ReactQuery'
import { SocketProvider } from './shared/components/SocketProvider'
import { Toaster } from './shared/components/ui/sonner'
import LayoutMain from './shared/layouts/LayoutMain'
import ROUTES from './shared/lib/routes'

const LoginPage = lazy(() => import('./features/auth/page').then((m) => ({ default: m.LoginPage })))
const NotFoundPage = lazy(() => import('./shared/pages/NotFoundPage'))
const AcademicYearsPage = lazy(() =>
  import('./features/academic-years/page').then((m) => ({ default: m.AcademicYearsPage }))
)
const BuildingsPage = lazy(() => import('./features/buildings/page').then((m) => ({ default: m.BuildingsPage })))
const ClassroomsPage = lazy(() => import('./features/classrooms/page').then((m) => ({ default: m.ClassroomsPage })))
const AcademicCredentialsPage = lazy(() =>
  import('./features/academic-credentails/page').then((m) => ({ default: m.AcademicCredentialsPage }))
)
const FacultyDepartmentsPage = lazy(() =>
  import('./features/faculty-departments/page').then((m) => ({ default: m.FacultyDepartmentsPage }))
)
const SubjectsPage = lazy(() => import('./features/subjects/page').then((m) => ({ default: m.SubjectsPage })))
const CoursesPage = lazy(() => import('./features/courses/page').then((m) => ({ default: m.CoursesPage })))
const ExemptionPercentagesPage = lazy(() =>
  import('./features/exemption-percentages/page').then((m) => ({ default: m.ExemptionPercentagesPage }))
)
const EducationalSystemsPage = lazy(() =>
  import('./features/educational-systems/page').then((m) => ({ default: m.EducationalSystemsPage }))
)
const LectureInvitationMoneysPage = lazy(() =>
  import('./features/lecture-invitation-money/page').then((m) => ({ default: m.LectureInvitationMoneysPage }))
)
const UserCreatePage = lazy(() => import('./features/users/pages').then((m) => ({ default: m.UserCreatePage })))
const UserEditPage = lazy(() => import('./features/users/pages').then((m) => ({ default: m.UserEditPage })))
const UsersActivePage = lazy(() => import('./features/users/pages').then((m) => ({ default: m.UsersActivePage })))
const UsersInactivePage = lazy(() => import('./features/users/pages').then((m) => ({ default: m.UsersInactivePage })))
const PermissionsPage = lazy(() => import('./features/permissions/page').then((m) => ({ default: m.PermissionsPage })))
const RolesPage = lazy(() => import('./features/roles/page').then((m) => ({ default: m.RolesPage })))
const RoleEditPage = lazy(() => import('./features/roles/page').then((m) => ({ default: m.RoleEditPage })))
const RoleCreatePage = lazy(() => import('./features/roles/page').then((m) => ({ default: m.RoleCreatePage })))
const AuditLogsPage = lazy(() => import('./features/audit-log/page').then((m) => ({ default: m.AuditLogsPage })))
const VisitingLecturerCreatePage = lazy(() =>
  import('./features/visiting-lecturers/pages').then((m) => ({ default: m.VisitingLecturerCreatePage }))
)
const VisitingLecturerEditPage = lazy(() =>
  import('./features/visiting-lecturers/pages').then((m) => ({ default: m.VisitingLecturerEditPage }))
)
const VisitingLecturersActivePage = lazy(() =>
  import('./features/visiting-lecturers/pages').then((m) => ({ default: m.VisitingLecturersActivePage }))
)
const VisitingLecturersInactivePage = lazy(() =>
  import('./features/visiting-lecturers/pages').then((m) => ({ default: m.VisitingLecturersInactivePage }))
)
const VisitingLecturersPendingPage = lazy(() =>
  import('./features/visiting-lecturers/pages').then((m) => ({ default: m.VisitingLecturersPendingPage }))
)
const TimetablesPage = lazy(() => import('./features/timetables/page').then((m) => ({ default: m.TimetablesPage })))
const StandardsPage = lazy(() => import('./features/standards/page').then((m) => ({ default: m.StandardsPage })))
const TimetableClassroomPage = lazy(() =>
  import('./features/timetable-classroom/page').then((m) => ({ default: m.TimetableClassroomPage }))
)
const BackupsPage = lazy(() => import('./features/backups/page').then((m) => ({ default: m.BackupsPage })))
const StandardLectureHoursPage = lazy(() =>
  import('./features/standard-lecture-hours/page').then((m) => ({ default: m.StandardLectureHoursPage }))
)

const router = createBrowserRouter([
  {
    loader: authLoader,
    element: <AuthGuard />,
    children: [
      {
        path: ROUTES.HOME.url,
        element: <LayoutMain />,
        children: [
          {
            path: ROUTES.ACADEMIC_YEARS.url,
            element: <AcademicYearsPage />
          },
          {
            path: ROUTES.BUILDINGS.url,
            element: <BuildingsPage />
          },
          {
            path: ROUTES.CLASSROOMS.url,
            element: <ClassroomsPage />
          },
          {
            path: ROUTES.ACADEMIC_CREDENTIALS.url,
            element: <AcademicCredentialsPage />
          },
          {
            path: ROUTES.EDUCATIONAL_SYSTEMS.url,
            element: <EducationalSystemsPage />
          },
          {
            path: ROUTES.FACULTY_DEPARTMENTS.url,
            element: <FacultyDepartmentsPage />
          },
          {
            path: ROUTES.SUBJECTS.url,
            element: <SubjectsPage />
          },
          {
            path: ROUTES.COURSES.url,
            element: <CoursesPage />
          },
          {
            path: ROUTES.EXEMPTION_PERCENTAGES.url,
            element: <ExemptionPercentagesPage />
          },
          {
            path: ROUTES.LECTURE_INVITATION_MONEYS.url,
            element: <LectureInvitationMoneysPage />
          },
          {
            path: ROUTES.USER_CREATE.url,
            element: <UserCreatePage />
          },
          {
            path: ROUTES.USER_EDIT.url,
            element: <UserEditPage />
          },
          {
            path: ROUTES.USERS_ACTIVE.url,
            element: <UsersActivePage />
          },
          {
            path: ROUTES.USERS_INACTIVE.url,
            element: <UsersInactivePage />
          },
          {
            path: ROUTES.PERMISSIONS.url,
            element: <PermissionsPage />
          },
          {
            path: ROUTES.ROLES.url,
            element: <RolesPage />
          },
          {
            path: ROUTES.ROLE_EDIT.url,
            element: <RoleEditPage />
          },
          {
            path: ROUTES.ROLE_CREATE.url,
            element: <RoleCreatePage />
          },
          {
            path: ROUTES.AUDIT_LOGS.url,
            element: <AuditLogsPage />
          },
          {
            path: ROUTES.VISITING_LECTURER_CREATE.url,
            element: <VisitingLecturerCreatePage />
          },
          {
            path: ROUTES.VISITING_LECTURER_EDIT.url,
            element: <VisitingLecturerEditPage />
          },
          {
            path: ROUTES.VISITING_LECTURERS_ACTIVE.url,
            element: <VisitingLecturersActivePage />
          },
          {
            path: ROUTES.VISITING_LECTURERS_INACTIVE.url,
            element: <VisitingLecturersInactivePage />
          },
          {
            path: ROUTES.VISITING_LECTURERS_PENDING.url,
            element: <VisitingLecturersPendingPage />
          },
          {
            path: ROUTES.TIMETABLES.url,
            element: <TimetablesPage />
          },
          {
            path: ROUTES.STANDARDS_EXPECTED.url,
            element: <StandardsPage />
          },
          {
            path: ROUTES.TIMETABLE_CLASSROOM.url,
            element: <TimetableClassroomPage />
          },
          {
            path: ROUTES.BACKUPS.url,
            element: <BackupsPage />
          },
          {
            path: ROUTES.STANDARD_LECTURE_HOURS.url,
            element: <StandardLectureHoursPage />
          }
        ]
      }
    ]
  },
  {
    path: ROUTES.LOGIN.url,
    element: <LoginPage />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])

export default function App() {
  return (
    <ReactQueryProvider>
      <GlobalLoadingPrivider>
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </GlobalLoadingPrivider>
      <Toaster position='top-right' richColors theme='light' />
    </ReactQueryProvider>
  )
}

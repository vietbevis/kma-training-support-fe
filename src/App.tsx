import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { AuthGuard } from './features/auth'
import { ReactQueryProvider } from './shared/components/ReactQuery'
import { Toaster } from './shared/components/ui/sonner'
import LayoutMain from './shared/layouts/LayoutMain'
import ROUTES from './shared/lib/routes'

const LoginPage = lazy(() => import('./features/auth/page').then((m) => ({ default: m.LoginPage })))
const AccountPage = lazy(() => import('./features/accounts/page').then((m) => ({ default: m.AccountPage })))
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

const router = createBrowserRouter([
  {
    element: <AuthGuard />,
    children: [
      {
        path: ROUTES.HOME.url,
        element: <LayoutMain />,
        children: [
          {
            path: ROUTES.ACCOUNTS.url,
            element: <AccountPage />
          },
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
            path: ROUTES.FACULTY_DEPARTMENTS.url,
            element: <FacultyDepartmentsPage />
          },
          {
            path: ROUTES.SUBJECTS.url,
            element: <SubjectsPage />
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
      <RouterProvider router={router} />
      <Toaster position='top-right' richColors theme='light' />
    </ReactQueryProvider>
  )
}

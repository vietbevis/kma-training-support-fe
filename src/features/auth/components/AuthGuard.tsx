import ROUTES from '@/shared/lib/routes'
import { Navigate, Outlet, useLoaderData, useLocation } from 'react-router'
import { authLoader } from '../api/AuthLoader'

const AuthGuard = () => {
  const { auth } = useLoaderData<typeof authLoader>()
  const location = useLocation()

  if (!auth) {
    return <Navigate to={ROUTES.LOGIN.url} state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}

export default AuthGuard

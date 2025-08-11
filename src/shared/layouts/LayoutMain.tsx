import { Link, Outlet, useLocation } from 'react-router'
import { AppSidebar } from '../components/app-sidebar'
import CommonDialog from '../components/CommonAlertDialog'
import ErrorBoundary from '../components/ErrorBoundary'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../components/ui/breadcrumb'
import { Separator } from '../components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../components/ui/sidebar'
import ROUTES from '../lib/routes'

export default function LayoutMain() {
  const location = useLocation()
  const pathname = location.pathname
  const currentRoute = Object.values(ROUTES).find((route) => route.url === pathname)?.title

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <Link to='/'>Trang chủ</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentRoute}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <ErrorBoundary>
          <main className='px-6 pb-6'>
            <Outlet />
            <CommonDialog />
          </main>
        </ErrorBoundary>
      </SidebarInset>
    </SidebarProvider>
  )
}

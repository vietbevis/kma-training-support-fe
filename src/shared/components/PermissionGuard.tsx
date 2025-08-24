import { useAuthStore } from '@/features/auth'
import { useGetPermissionByUserId } from '@/features/permissions'
import { hasPermission, type PermissionRequirement } from '@/shared/lib/utils'
import { AlertCircle } from 'lucide-react'
import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

export interface PermissionGuardProps {
  children: React.ReactNode
  requiredPermission: PermissionRequirement
  fallback?: React.ReactNode
  showError?: boolean
}

/**
 * Component bảo vệ nội dung dựa trên permission của user
 * @param children - Nội dung cần bảo vệ
 * @param requiredPermission - Permission cần thiết để hiển thị
 * @param fallback - Component hiển thị khi không có permission (mặc định là null)
 * @param showError - Có hiển thị thông báo lỗi khi không có permission
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  fallback = null,
  showError = false
}) => {
  const { userId } = useAuthStore()
  const { data: permissions, isLoading } = useGetPermissionByUserId(userId || '')

  // Loading state
  if (isLoading) {
    return <LoadingSpinner isLoading={true} className='py-4' />
  }

  // Check permission
  const userPermissions =
    permissions?.data?.map((p) => ({
      method: p.method,
      path: p.path
    })) || []

  const hasAccess = hasPermission(userPermissions, requiredPermission)

  if (!hasAccess) {
    if (showError) {
      return (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn không có quyền truy cập tài nguyên này. Vui lòng liên hệ quản trị viên để được cấp quyền.
          </AlertDescription>
        </Alert>
      )
    }
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * HOC để bảo vệ page dựa trên permission
 * @param Component - Component cần bảo vệ
 * @param requiredPermission - Permission cần thiết để truy cập page
 */
export function withPermissionGuard<T extends object>(
  Component: React.ComponentType<T>,
  requiredPermission: PermissionRequirement
) {
  const ProtectedComponent = (props: T) => {
    const { userId } = useAuthStore()
    const { data: permissions, isLoading } = useGetPermissionByUserId(userId || '')

    // Loading state
    if (isLoading) {
      return (
        <div className='flex justify-center items-center min-h-[400px]'>
          <LoadingSpinner isLoading={true} className='py-20' />
        </div>
      )
    }

    // Check permission
    const userPermissions =
      permissions?.data?.map((p) => ({
        method: p.method,
        path: p.path
      })) || []

    const hasAccess = hasPermission(userPermissions, requiredPermission)

    if (!hasAccess) {
      return (
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='text-center space-y-4 max-w-md'>
            <div className='mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center'>
              <AlertCircle className='h-8 w-8 text-destructive' />
            </div>
            <div>
              <h2 className='text-xl font-semibold'>Không có quyền truy cập</h2>
              <p className='text-muted-foreground mt-2'>
                Bạn không có quyền truy cập tài nguyên này. Vui lòng liên hệ quản trị viên để được cấp quyền.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }

  ProtectedComponent.displayName = `withPermissionGuard(${Component.displayName || Component.name})`

  return ProtectedComponent
}

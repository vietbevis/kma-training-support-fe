import type { PermissionRequirement } from '@/shared/lib/utils'
import React from 'react'
import { PermissionGuard, type PermissionGuardProps } from './PermissionGuard'
import { Button, type ButtonProps } from './ui/button'

type PermissionButtonProps = ButtonProps &
  PermissionGuardProps & {
    asChild?: boolean
  }

/**
 * Button wrapper với permission checking
 * Chỉ hiển thị button khi user có permission tương ứng
 */
export const PermissionButton: React.FC<PermissionButtonProps> = ({
  requiredPermission,
  children,
  fallback,
  showError,
  ...buttonProps
}) => {
  return (
    <PermissionGuard requiredPermission={requiredPermission} fallback={fallback} showError={showError}>
      <Button {...buttonProps}>{children}</Button>
    </PermissionGuard>
  )
}

/**
 * Component wrapper chung cho bất kỳ element nào cần permission checking
 */
interface PermissionWrapperProps {
  requiredPermission: PermissionRequirement
  children: React.ReactNode
  fallback?: React.ReactNode
  showError?: boolean
}

export const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  requiredPermission,
  children,
  fallback = null,
  showError = false
}) => {
  return (
    <PermissionGuard requiredPermission={requiredPermission} fallback={fallback} showError={showError}>
      {children}
    </PermissionGuard>
  )
}

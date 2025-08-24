import { useGetRoleById, useUpdateRole } from '@/features/roles/api/RoleService'
import { RoleForm } from '@/features/roles/components'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PERMISSIONS } from '@/shared/constants/permissions'
import ROUTES from '@/shared/lib/routes'
import type { UpdateRoleType } from '@/shared/validations/RoleSchema'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

const RoleEditPageComponent = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  if (!id) {
    navigate('/roles')
    return null
  }

  // Get role data
  const { data: roleData, isLoading: isLoadingRole } = useGetRoleById(id)
  const role = roleData?.data

  // Get role permissions
  const rolePermissions = roleData?.data.permissions || []

  const { mutateAsync: updateRole, isPending: isUpdatingRole } = useUpdateRole()

  const handleSubmit = async (formData: UpdateRoleType) => {
    await updateRole({ id, ...formData })
    toast.success('Cập nhật vai trò thành công')
    navigate(ROUTES.ROLES.url)
  }

  const handleBack = () => {
    navigate(ROUTES.ROLES.url)
  }

  if (isLoadingRole) {
    return (
      <div className='flex justify-center items-center py-20 absolute inset-0 bg-background/80 backdrop-blur-sm z-10'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!role) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon' onClick={handleBack}>
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Vai trò không tồn tại</h1>
            <p className='text-muted-foreground'>Không tìm thấy vai trò với ID này</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' onClick={handleBack}>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Chỉnh sửa vai trò</h1>
          <p className='text-muted-foreground'>Cập nhật thông tin và quyền của vai trò: {role.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Chỉnh sửa vai trò</CardTitle>
        </CardHeader>
        <CardContent>
          <RoleForm
            mode='edit'
            initialData={role}
            initialPermissions={rolePermissions}
            onSubmit={handleSubmit}
            isLoading={isUpdatingRole}
          />
        </CardContent>
      </Card>
    </div>
  )
}

// Apply permission guard
export const RoleEditPage = withPermissionGuard(RoleEditPageComponent, PERMISSIONS.ROLES.UPDATE)

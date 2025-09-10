import { useDeleteRole, useGetRoles } from '@/features/roles/api/RoleService'
import { RoleFilters, RoleTable } from '@/features/roles/components'
import { PaginationComponent } from '@/shared/components/Pagination'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import ROUTES from '@/shared/lib/routes'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type { RoleType } from '@/shared/validations/RoleSchema'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

const RolesPageComponent = () => {
  const { openDialog, closeDialog } = useDialogStore()
  const navigate = useNavigate()

  const { filters, resetFilters, setFilters } = useSearchParamsManager({
    page: '1',
    limit: '10',
    search: '',
    isActive: '',
    isSystemRole: '',
    scopeFacultyDepartmentId: ''
  })
  const { data, isLoading } = useGetRoles({
    ...filters,
    page: Number(filters.page),
    limit: Number(filters.limit),
    isActive: filters.isActive !== '' ? filters.isActive === 'true' : undefined,
    isSystemRole: filters.isSystemRole !== '' ? filters.isSystemRole === 'true' : undefined
  })

  const roles = data?.data.data || []
  const meta = data?.data.meta

  const { mutateAsync: deleteRole } = useDeleteRole()

  const handleDelete = (id: string) => {
    openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác.',
      loading: false,
      onConfirm: async () => {
        await deleteRole(id)
        toast.success('Xóa vai trò thành công')
        closeDialog()
      }
    })
  }

  const handleEdit = (role: RoleType) => {
    navigate(`/roles/${role.id}/edit`)
  }

  const handleDuplicate = (role: RoleType) => {
    navigate(`${ROUTES.ROLE_CREATE.url}?duplicate=${role.id}`)
  }

  return (
    <>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Quản lý vai trò</h1>
            <p className='text-muted-foreground'>Tạo vai trò và phân quyền cho nhân viên trong hệ thống</p>
          </div>
          <PermissionButton
            onClick={() => navigate(ROUTES.ROLE_CREATE.url)}
            className='cursor-pointer'
            requiredPermission={PERMISSIONS.ROLES.CREATE}
          >
            <Plus className='mr-2 h-4 w-4' />
            Thêm vai trò
          </PermissionButton>
        </div>

        <RoleFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

        <Card>
          <CardHeader>
            <CardTitle>Danh sách vai trò ({meta?.total || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <RoleTable
              roles={roles}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {meta && <PaginationComponent meta={meta} setFilter={setFilters} />}
      </div>
    </>
  )
}

// Apply permission guard
export const RolesPage = withPermissionGuard(RolesPageComponent, PERMISSIONS.ROLES.LIST)

import { useDeleteRole, useGetRoles } from '@/features/roles/api/RoleService'
import { RoleFilters, RoleTable } from '@/features/roles/components'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import ROUTES from '@/shared/lib/routes'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type { RoleType } from '@/shared/validations/RoleSchema'
import { Plus } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'

export const RolesPage = () => {
  const { openDialog, closeDialog } = useDialogStore()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const { data, isLoading } = useGetRoles({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    search: searchParams.get('search') || '',
    isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
    isSystemRole: searchParams.get('isSystemRole') ? searchParams.get('isSystemRole') === 'true' : undefined,
    scopeFacultyDepartmentId: searchParams.get('scopeFacultyDepartmentId') || undefined
  })

  const roles = data?.data.data || []

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

  return (
    <>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Quản lý vai trò</h1>
            <p className='text-muted-foreground'>Tạo vai trò và phân quyền cho người dùng trong hệ thống</p>
          </div>
          <Button onClick={() => navigate(ROUTES.ROLE_CREATE.url)} className='cursor-pointer'>
            <Plus className='mr-2 h-4 w-4' />
            Thêm vai trò
          </Button>
        </div>

        <RoleFilters />

        <Card>
          <CardHeader>
            <CardTitle>Danh sách vai trò ({roles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <RoleTable roles={roles} onEdit={handleEdit} onDelete={handleDelete} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

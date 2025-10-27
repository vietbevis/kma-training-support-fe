import { PaginationComponent } from '@/shared/components/Pagination'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import ROUTES from '@/shared/lib/routes'
import { useDialogStore } from '@/shared/stores/dialogStore'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { useGetUsersQuery } from '../api/UserService'
import { UserFilters, UserTable } from '../components'

const UsersInactivePageComponent = () => {
  const { filters, resetFilters, setFilters } = useSearchParamsManager({
    page: '1',
    limit: '10',
    search: '',
    facultyDepartmentId: '',
    subjectId: '',
    academicCredentialId: '',
    gender: '',
    areTeaching: 'false' // Set sẵn filter đã ngừng giảng dạy
  })

  const { data, isLoading, isFetching } = useGetUsersQuery({
    ...filters,
    page: Number(filters.page),
    limit: Number(filters.limit),
    facultyDepartmentId: filters.facultyDepartmentId || '',
    subjectId: filters.subjectId || '',
    academicCredentialId: filters.academicCredentialId || '',
    gender: filters.gender || '',
    areTeaching: false // Force false cho trang này
  })

  const users = data?.data.data || []
  const meta = data?.data.meta

  const dialogStore = useDialogStore()

  const handleDelete = (id: string) => {
    const user = users.find((u) => u.id === id)
    if (!user) return

    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa nhân viên',
      description: `Bạn có chắc chắn muốn xóa nhân viên "${user.fullName}"? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        toast.success('Chức năng này đang được phát triển')
        dialogStore.closeDialog()
      }
    })
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Nhân viên đã ngừng giảng dạy</h1>
          <p className='text-muted-foreground'>Danh sách nhân viên đã ngừng giảng dạy ({users.length} nhân viên)</p>
        </div>
        <PermissionButton asChild className='flex items-center gap-2' requiredPermission={PERMISSIONS.USERS.CREATE}>
          <Link to={ROUTES.USER_CREATE.url}>
            <Plus className='h-4 w-4' />
            Thêm nhân viên mới
          </Link>
        </PermissionButton>
      </div>

      <UserFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên đã ngừng giảng dạy ({meta?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable data={users} isLoading={isLoading} isFilterLoading={isFetching} onDelete={handleDelete} />
        </CardContent>
      </Card>

      {meta && <PaginationComponent meta={meta} setFilter={setFilters} />}
    </div>
  )
}

// Apply permission guard
export const UsersInactivePage = withPermissionGuard(UsersInactivePageComponent, PERMISSIONS.USERS.LIST)

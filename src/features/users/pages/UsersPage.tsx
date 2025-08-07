import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import ROUTES from '@/shared/lib/routes'
import { useDialogStore } from '@/shared/stores/dialogStore'
import { Plus } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { useDeleteUserMutation, useGetUsersQuery } from '../api/UserService'
import { UserFilters, UserTable } from '../components'

export const UsersPage = () => {
  const [searchParams] = useSearchParams()

  const { data, isLoading, isFetching } = useGetUsersQuery({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    search: searchParams.get('search') || '',
    facultyDepartmentId: searchParams.get('facultyDepartmentId') || '',
    subjectId: searchParams.get('subjectId') || '',
    academicCredentialId: searchParams.get('academicCredentialId') || '',
    gender: searchParams.get('gender') || '',
    areTeaching: searchParams.get('areTeaching') ? searchParams.get('areTeaching') === 'true' : undefined
  })

  const users = data?.data.data || []

  const deleteUserMutation = useDeleteUserMutation()
  const dialogStore = useDialogStore()

  const handleDelete = (id: string) => {
    const user = users.find((u) => u.id === id)
    if (!user) return

    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa nhân viên',
      description: `Bạn có chắc chắn muốn xóa nhân viên "${user.fullName}"? Hành động này không thể hoàn tác.`,
      onConfirm: () => {
        deleteUserMutation.mutate(id)
        dialogStore.closeDialog()
      }
    })
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Quản lý nhân viên</h1>
          <p className='text-muted-foreground'>Quản lý thông tin nhân viên trong hệ thống ({users.length} nhân viên)</p>
        </div>
        <Button asChild className='flex items-center gap-2'>
          <Link to={ROUTES.USER_CREATE.url}>
            <Plus className='h-4 w-4' />
            Thêm nhân viên mới
          </Link>
        </Button>
      </div>

      <UserFilters />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable data={users} isLoading={isLoading} isFilterLoading={isFetching} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  )
}

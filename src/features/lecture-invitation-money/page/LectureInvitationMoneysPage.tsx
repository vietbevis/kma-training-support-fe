import { PaginationComponent } from '@/shared/components/Pagination'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  CreateLectureInvitationMoney,
  LectureInvitationMoney,
  UpdateLectureInvitationMoney
} from '@/shared/validations/LectureInvitationMoneySchema'
import { Plus } from 'lucide-react'
import {
  useCreateLectureInvitationMoneyMutation,
  useDeleteLectureInvitationMoneyMutation,
  useLectureInvitationMoneysQuery,
  useUpdateLectureInvitationMoneyMutation
} from '../api/LectureInvitationMoneyService'
import { LectureInvitationMoneyFilters, LectureInvitationMoneyForm, LectureInvitationMoneyTable } from '../components'

const LectureInvitationMoneysPageComponent = () => {
  const dialogStore = useDialogStore()

  const { filters, resetFilters, setFilters } = useSearchParamsManager({
    page: '1',
    limit: '10',
    search: '',
    academicCredentialId: ''
  })

  const { data, isLoading, isFetching } = useLectureInvitationMoneysQuery(filters)

  const items = data?.data.data || []
  const meta = data?.data.meta

  const { mutateAsync: createMutation, isPending: isCreating } = useCreateLectureInvitationMoneyMutation()
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteLectureInvitationMoneyMutation()
  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateLectureInvitationMoneyMutation()

  const handleDelete = (id: string) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa tiền mời giảng này? Hành động này không thể hoàn tác.',
      loading: isDeleting,
      onConfirm: async () => {
        await deleteMutation(id)
        dialogStore.closeDialog()
      }
    })
  }

  const handleOpenCreate = () => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Thêm tiền mời giảng mới',
      description: 'Thêm tiền mời giảng mới vào hệ thống',
      content: (
        <LectureInvitationMoneyForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleEdit = (item: LectureInvitationMoney) => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Chỉnh sửa tiền mời giảng',
      description: 'Chỉnh sửa thông tin tiền mời giảng đã tồn tại',
      content: (
        <LectureInvitationMoneyForm
          mode='edit'
          initialData={item}
          onSubmit={(formData) => handleFormSubmit(formData, 'edit', item.id)}
          isLoading={isUpdating}
        />
      )
    })
  }

  const handleFormSubmit = async (
    formData: CreateLectureInvitationMoney | UpdateLectureInvitationMoney,
    formMode: 'create' | 'edit',
    editingId?: string
  ) => {
    if (formMode === 'create') {
      await createMutation(formData)
    } else if (formMode === 'edit' && editingId) {
      await updateMutation({ id: editingId, data: formData })
    }
    dialogStore.closeDialog()
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Quản lý tiền mời giảng</h1>
          <p className='text-muted-foreground'>Quản lý danh sách các tiền mời giảng trong hệ thống</p>
        </div>
        <div className='flex gap-2'>
          <PermissionButton onClick={handleOpenCreate} requiredPermission={PERMISSIONS.LECTURE_INVITATION_MONEY.CREATE}>
            <Plus className='h-4 w-4 mr-2' />
            Thêm tiền mời giảng
          </PermissionButton>
        </div>
      </div>

      <LectureInvitationMoneyFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách tiền mời giảng ({meta?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <LectureInvitationMoneyTable
            data={items}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isFilterLoading={isFetching}
          />
        </CardContent>
      </Card>

      {meta && <PaginationComponent meta={meta} setFilter={setFilters} />}
    </div>
  )
}

export const LectureInvitationMoneysPage = withPermissionGuard(
  LectureInvitationMoneysPageComponent,
  PERMISSIONS.LECTURE_INVITATION_MONEY.LIST
)

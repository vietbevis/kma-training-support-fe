import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  CreateLectureInvitationMoney,
  LectureInvitationMoney,
  UpdateLectureInvitationMoney
} from '@/shared/validations/LectureInvitationMoneySchema'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router'
import {
  useCreateLectureInvitationMoneyMutation,
  useDeleteLectureInvitationMoneyMutation,
  useLectureInvitationMoneysQuery,
  useUpdateLectureInvitationMoneyMutation
} from '../api/LectureInvitationMoneyService'
import { LectureInvitationMoneyFilters, LectureInvitationMoneyForm, LectureInvitationMoneyTable } from '../components'

export const LectureInvitationMoneysPage = () => {
  const dialogStore = useDialogStore()

  const [searchParams] = useSearchParams()
  const { data, isLoading } = useLectureInvitationMoneysQuery({
    search: searchParams.get('search') || undefined,
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    academicCredentialId: searchParams.get('academicCredentialId') || undefined
  })

  const items = data?.data.data || []

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
          <Button onClick={handleOpenCreate}>
            <Plus className='h-4 w-4 mr-2' />
            Thêm tiền mời giảng
          </Button>
        </div>
      </div>

      <LectureInvitationMoneyFilters />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách tiền mời giảng ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <LectureInvitationMoneyTable data={items} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  )
}

import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  CreateExemptionPercentage,
  ExemptionPercentage,
  UpdateExemptionPercentage
} from '@/shared/validations/ExemptionPercentageSchema'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router'
import {
  useCreateExemptionPercentageMutation,
  useDeleteExemptionPercentageMutation,
  useExemptionPercentagesQuery,
  useUpdateExemptionPercentageMutation
} from '../api/ExemptionPercentageService'
import { ExemptionPercentageFilters, ExemptionPercentageForm, ExemptionPercentageTable } from '../components'

export const ExemptionPercentagesPage = () => {
  const dialogStore = useDialogStore()

  const [searchParams] = useSearchParams()
  const { data, isLoading } = useExemptionPercentagesQuery({
    search: searchParams.get('search') || undefined,
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10
  })

  const exemptionPercentages = data?.data.data || []

  const { mutateAsync: createMutation, isPending: isCreating } = useCreateExemptionPercentageMutation()
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteExemptionPercentageMutation()
  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateExemptionPercentageMutation()

  const handleDelete = (id: string) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa phần trăm miễn giảm này? Hành động này không thể hoàn tác.',
      loading: isDeleting,
      onConfirm: async () => {
        try {
          await deleteMutation(id)
          dialogStore.closeDialog()
        } catch (error) {
          console.error(error)
        }
      }
    })
  }

  const handleOpenCreate = () => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Thêm phần trăm miễn giảm mới',
      description: 'Thêm phần trăm miễn giảm mới vào hệ thống',
      content: (
        <ExemptionPercentageForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleEdit = (exemptionPercentage: ExemptionPercentage) => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Chỉnh sửa phần trăm miễn giảm',
      description: 'Chỉnh sửa thông tin phần trăm miễn giảm đã tồn tại',
      content: (
        <ExemptionPercentageForm
          mode='edit'
          initialData={exemptionPercentage}
          onSubmit={(formData) => handleFormSubmit(formData, 'edit', exemptionPercentage.id)}
          isLoading={isUpdating}
        />
      )
    })
  }

  const handleFormSubmit = async (
    formData: CreateExemptionPercentage | UpdateExemptionPercentage,
    formMode: 'create' | 'edit',
    editingId?: string
  ) => {
    try {
      if (formMode === 'create') {
        await createMutation(formData as CreateExemptionPercentage)
      } else if (formMode === 'edit' && editingId) {
        await updateMutation({ id: editingId, data: formData as UpdateExemptionPercentage })
      }
      dialogStore.closeDialog()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Quản lý phần trăm miễn giảm</h1>
          <p className='text-muted-foreground'>Quản lý danh sách các phần trăm miễn giảm trong hệ thống</p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={handleOpenCreate}>
            <Plus className='h-4 w-4 mr-2' />
            Thêm phần trăm miễn giảm
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ExemptionPercentageFilters />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phần trăm miễn giảm ({exemptionPercentages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ExemptionPercentageTable
            data={exemptionPercentages}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}

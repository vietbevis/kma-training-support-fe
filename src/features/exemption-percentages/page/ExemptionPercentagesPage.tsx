import { PaginationComponent } from '@/shared/components/Pagination'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  CreateExemptionPercentage,
  ExemptionPercentage,
  UpdateExemptionPercentage
} from '@/shared/validations/ExemptionPercentageSchema'
import { Plus } from 'lucide-react'
import {
  useCreateExemptionPercentageMutation,
  useDeleteExemptionPercentageMutation,
  useExemptionPercentagesQuery,
  useUpdateExemptionPercentageMutation
} from '../api/ExemptionPercentageService'
import { ExemptionPercentageFilters, ExemptionPercentageForm, ExemptionPercentageTable } from '../components'

const ExemptionPercentagesPageComponent = () => {
  const dialogStore = useDialogStore()

  const { filters, resetFilters, setFilters } = useSearchParamsManager({
    page: '1',
    limit: '10',
    search: ''
  })

  const { data, isLoading, isFetching } = useExemptionPercentagesQuery(filters)

  const exemptionPercentages = data?.data.data || []
  const meta = data?.data.meta

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
        await deleteMutation(id)
        dialogStore.closeDialog()
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
    if (formMode === 'create') {
      await createMutation(formData as CreateExemptionPercentage)
    } else if (formMode === 'edit' && editingId) {
      await updateMutation({ id: editingId, data: formData as UpdateExemptionPercentage })
    }
    dialogStore.closeDialog()
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
      <ExemptionPercentageFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

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
            isFilterLoading={isFetching}
          />
        </CardContent>
      </Card>

      {meta && <PaginationComponent meta={meta} setFilter={setFilters} />}
    </div>
  )
}

export const ExemptionPercentagesPage = withPermissionGuard(
  ExemptionPercentagesPageComponent,
  PERMISSIONS.EXEMPTION_PERCENTAGES.LIST
)

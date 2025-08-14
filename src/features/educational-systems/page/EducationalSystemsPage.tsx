import { PaginationComponent } from '@/shared/components/Pagination'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type { EducationalSystem } from '@/shared/validations/EducationalSystemSchema'
import { Plus } from 'lucide-react'
import {
  useCreateEducationalSystemMutation,
  useDeleteEducationalSystemMutation,
  useEducationalSystemsQuery,
  useUpdateEducationalSystemMutation
} from '../api/EducationalSystemService'
import { EducationalSystemFilters, EducationalSystemForm, EducationalSystemTable } from '../components'

export const EducationalSystemsPage = () => {
  const dialogStore = useDialogStore()

  const { filters, resetFilters, setFilters } = useSearchParamsManager({
    page: '1',
    limit: '10',
    search: '',
    educationLevels: '',
    tuitions: ''
  })

  const { data, isLoading, isFetching } = useEducationalSystemsQuery(filters)

  const items = data?.data.data || []
  const meta = data?.data.meta

  const { mutateAsync: createMutation, isPending: isCreating } = useCreateEducationalSystemMutation()
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteEducationalSystemMutation()
  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateEducationalSystemMutation()

  const handleDelete = (id: string) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa hệ đào tạo này? Hành động này không thể hoàn tác.',
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
      title: 'Thêm hệ đào tạo mới',
      description: 'Thêm hệ đào tạo mới vào hệ thống',
      content: (
        <EducationalSystemForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleEdit = (item: EducationalSystem) => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Chỉnh sửa hệ đào tạo',
      description: 'Chỉnh sửa thông tin hệ đào tạo đã tồn tại',
      content: (
        <EducationalSystemForm
          mode='edit'
          initialData={item}
          onSubmit={(formData) => handleFormSubmit(formData, 'edit', item.id)}
          isLoading={isUpdating}
        />
      )
    })
  }

  const handleFormSubmit = async (
    formData: Parameters<typeof useCreateEducationalSystemMutation>['length'] extends never ? never : any,
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
          <h1 className='text-3xl font-bold'>Quản lý hệ đào tạo</h1>
          <p className='text-muted-foreground'>Quản lý danh sách các hệ đào tạo trong hệ thống</p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={handleOpenCreate}>
            <Plus className='h-4 w-4 mr-2' />
            Thêm hệ đào tạo
          </Button>
        </div>
      </div>

      <EducationalSystemFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hệ đào tạo ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <EducationalSystemTable
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

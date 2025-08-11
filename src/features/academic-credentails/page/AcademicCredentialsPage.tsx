import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  AcademicCredential,
  CreateAcademicCredentialSchemaType,
  UpdateAcademicCredentialSchemaType
} from '@/shared/validations/AcademicCredentialSchema'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router'
import {
  useAcademicCredentialsQuery,
  useCreateAcademicCredentialMutation,
  useDeleteAcademicCredentialMutation,
  useUpdateAcademicCredentialMutation
} from '../api/AcademicCredentialService'
import { AcademicCredentialFilters, AcademicCredentialForm, AcademicCredentialTable } from '../components'

export const AcademicCredentialsPage = () => {
  const dialogStore = useDialogStore()

  const [searchParams] = useSearchParams()
  const { data, isLoading } = useAcademicCredentialsQuery({
    search: searchParams.get('search') || undefined,
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10
  })

  const academicCredentials = data?.data.data || []

  const { mutateAsync: createMutation, isPending: isCreating } = useCreateAcademicCredentialMutation()
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteAcademicCredentialMutation()
  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateAcademicCredentialMutation()

  const handleDelete = (id: string) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa học hàm/học vị này? Hành động này không thể hoàn tác.',
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
      title: 'Thêm học hàm/học vị mới',
      description: 'Thêm học hàm/học vị mới vào hệ thống',
      content: (
        <AcademicCredentialForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleEdit = (academicCredential: AcademicCredential) => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Chỉnh sửa học hàm/học vị',
      description: 'Chỉnh sửa thông tin tòa nhà đã tồn tại',
      content: (
        <AcademicCredentialForm
          mode='edit'
          initialData={academicCredential}
          onSubmit={(formData) => handleFormSubmit(formData, 'edit', academicCredential.id)}
          isLoading={isUpdating}
        />
      )
    })
  }

  const handleFormSubmit = async (
    formData: CreateAcademicCredentialSchemaType | UpdateAcademicCredentialSchemaType,
    formMode: 'create' | 'edit',
    editingId?: string
  ) => {
    if (formMode === 'create') {
      await createMutation(formData as CreateAcademicCredentialSchemaType)
    } else if (formMode === 'edit' && editingId) {
      await updateMutation({ id: editingId, data: formData as UpdateAcademicCredentialSchemaType })
    }
    dialogStore.closeDialog()
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Quản lý học hàm/học vị</h1>
          <p className='text-muted-foreground'>Quản lý danh sách các học hàm/học vị trong hệ thống</p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={handleOpenCreate}>
            <Plus className='h-4 w-4 mr-2' />
            Thêm học hàm/học vị
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AcademicCredentialFilters />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách học hàm/học vị ({academicCredentials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <AcademicCredentialTable
            data={academicCredentials}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}

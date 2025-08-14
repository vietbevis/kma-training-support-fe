import { PaginationComponent } from '@/shared/components/Pagination'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  AcademicYearSchemaType,
  CreateAcademicYearSchemaType,
  UpdateAcademicYearSchemaType
} from '@/shared/validations/AcademicYearSchema'
import { Plus } from 'lucide-react'
import {
  useCreateAcademicYearMutation,
  useDeleteAcademicYearMutation,
  useGetAcademicYearsQuery,
  useUpdateAcademicYearMutation
} from '../api/AcademicYearService'
import { AcademicYearFilters, AcademicYearForm, AcademicYearTable } from '../components'

export const AcademicYearsPage = () => {
  const dialogStore = useDialogStore()

  const { filters, resetFilters, setFilters } = useSearchParamsManager({
    page: '',
    limit: '10',
    search: ''
  })

  const { data, isLoading, isFetching } = useGetAcademicYearsQuery(filters)

  const academicYears = data?.data.data || []
  const meta = data?.data.meta
  const { mutateAsync: createMutation, isPending: isCreating } = useCreateAcademicYearMutation()
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteAcademicYearMutation()
  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateAcademicYearMutation()

  const handleDelete = (id: string) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa năm học này? Hành động này không thể hoàn tác.',
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
      title: 'Thêm năm học mới',
      description: 'Thêm năm học mới vào hệ thống',
      content: (
        <AcademicYearForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleEdit = (academicYear: AcademicYearSchemaType) => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Chỉnh sửa năm học',
      description: 'Chỉnh sửa thông tin năm học đã tồn tại',
      content: (
        <AcademicYearForm
          mode='edit'
          initialData={academicYear}
          onSubmit={(formData) => handleFormSubmit(formData, 'edit', academicYear.id)}
          isLoading={isUpdating}
        />
      )
    })
  }

  const handleFormSubmit = async (
    formData: CreateAcademicYearSchemaType | UpdateAcademicYearSchemaType,
    formMode: 'create' | 'edit',
    editingAcademicYearId?: string
  ) => {
    if (formMode === 'create') {
      await createMutation(formData as CreateAcademicYearSchemaType)
    } else if (formMode === 'edit' && editingAcademicYearId) {
      await updateMutation({ id: editingAcademicYearId, data: formData as UpdateAcademicYearSchemaType })
    }
    dialogStore.closeDialog()
  }

  return (
    <>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Quản lý năm học</h1>
            <p className='text-muted-foreground'>Quản lý danh sách năm học trong hệ thống</p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className='h-4 w-4 mr-2' />
            Thêm năm học
          </Button>
        </div>

        <AcademicYearFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

        <Card>
          <CardHeader>
            <CardTitle>Danh sách năm học ({academicYears.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <AcademicYearTable
              data={academicYears}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isFilterLoading={isFetching}
            />
          </CardContent>
        </Card>

        {meta && <PaginationComponent meta={meta} setFilter={setFilters} />}
      </div>
    </>
  )
}

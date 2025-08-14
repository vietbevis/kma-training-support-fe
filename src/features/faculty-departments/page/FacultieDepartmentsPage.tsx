import { PaginationComponent } from '@/shared/components/Pagination'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  CreateFacultyDepartmentSchemaType,
  FacultyDepartmentSchemaType,
  UpdateFacultyDepartmentSchemaType
} from '@/shared/validations/FacultyDepartmentSchema'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  useCreateFacultyDepartmentMutation,
  useFacultyDepartmentsQuery,
  useUpdateFacultyDepartmentMutation
} from '../api/FacultyDepartmentService'
import { FacultyDepartmentFilters, FacultyDepartmentForm, FacultyDepartmentTable } from '../components'

export const FacultyDepartmentsPage = () => {
  const dialogStore = useDialogStore()

  const { filters, resetFilters, setFilters } = useSearchParamsManager({
    page: '1',
    limit: '10',
    search: '',
    isFaculty: ''
  })

  const { data, isLoading, isFetching } = useFacultyDepartmentsQuery({
    ...filters,
    isFaculty: filters.isFaculty !== '' ? filters.isFaculty === 'true' : undefined
  })

  const facultyDepartments = data?.data.data || []
  const meta = data?.data.meta

  const { mutateAsync: createMutation, isPending: isCreating } = useCreateFacultyDepartmentMutation()
  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateFacultyDepartmentMutation()

  const handleDelete = (id: string) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa khoa/phòng ban này? Hành động này không thể hoàn tác.',
      loading: false,
      onConfirm: () => {
        console.log('Delete faculty with id:', id)
        toast.info('Chức năng này đang được phát triển')
        dialogStore.closeDialog()
      }
    })
  }

  const handleOpenCreate = () => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Thêm khoa/phòng ban mới',
      description: 'Thêm khoa/phòng ban mới vào hệ thống',
      content: (
        <FacultyDepartmentForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleEdit = (facultyDepartment: FacultyDepartmentSchemaType) => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Chỉnh sửa khoa/phòng ban',
      description: 'Chỉnh sửa thông tin khoa/phòng ban đã tồn tại',
      content: (
        <FacultyDepartmentForm
          mode='edit'
          initialData={facultyDepartment}
          onSubmit={(formData) => handleFormSubmit(formData, 'edit', facultyDepartment.id)}
          isLoading={isUpdating}
        />
      )
    })
  }

  const handleFormSubmit = async (
    formData: CreateFacultyDepartmentSchemaType | UpdateFacultyDepartmentSchemaType,
    formMode: 'create' | 'edit',
    editingFacultyDepartmentId?: string
  ) => {
    if (formMode === 'create') {
      await createMutation(formData as CreateFacultyDepartmentSchemaType)
    } else if (formMode === 'edit' && editingFacultyDepartmentId) {
      await updateMutation({ id: editingFacultyDepartmentId, data: formData as UpdateFacultyDepartmentSchemaType })
    }
    dialogStore.closeDialog()
  }

  return (
    <>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Quản lý khoa/phòng ban</h1>
            <p className='text-muted-foreground'>Quản lý danh sách các khoa và phòng ban trong hệ thống</p>
          </div>
          <div className='flex gap-2'>
            <Button onClick={handleOpenCreate}>
              <Plus className='h-4 w-4 mr-2' />
              Thêm khoa/phòng ban
            </Button>
          </div>
        </div>

        <FacultyDepartmentFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

        <Card>
          <CardHeader>
            <CardTitle>Danh sách khoa/phòng ban ({facultyDepartments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <FacultyDepartmentTable
              data={facultyDepartments}
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

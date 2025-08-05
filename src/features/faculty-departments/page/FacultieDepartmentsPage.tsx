import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  CreateFacultyDepartmentSchemaType,
  FacultyDepartmentSchemaType,
  UpdateFacultyDepartmentSchemaType
} from '@/shared/validations/FacultyDepartmentSchema'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'
import {
  useCreateFacultyDepartmentMutation,
  useFacultyDepartmentsQuery,
  useUpdateFacultyDepartmentMutation
} from '../api/FacultyDepartmentService'
import { FacultyDepartmentFilters, FacultyDepartmentForm, FacultyDepartmentTable } from '../components'

export const FacultyDepartmentsPage = () => {
  const dialogStore = useDialogStore()

  const [searchParams] = useSearchParams()
  const { data, isLoading } = useFacultyDepartmentsQuery({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    search: searchParams.get('search') || undefined,
    isFaculty: searchParams.get('isFaculty') ? searchParams.get('isFaculty') === 'true' : undefined
  })

  const facultyDepartments = data?.data.data || []

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
    console.log('🚀 ~ handleFormSubmit ~ formData:', formData)
    try {
      if (formMode === 'create') {
        await createMutation(formData as CreateFacultyDepartmentSchemaType)
      } else if (formMode === 'edit' && editingFacultyDepartmentId) {
        await updateMutation({ id: editingFacultyDepartmentId, data: formData as UpdateFacultyDepartmentSchemaType })
      }
      dialogStore.closeDialog()
    } catch (error) {
      console.error(error)
    }
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

        <FacultyDepartmentFilters />

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
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

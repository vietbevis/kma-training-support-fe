import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type { Course, CreateCourse, UpdateCourse } from '@/shared/validations/CourseSchema'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router'
import {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useUpdateCourseMutation
} from '../api/CourseService'
import { CourseFilters, CourseForm, CourseTable } from '../components'

export const CoursesPage = () => {
  const dialogStore = useDialogStore()

  const [searchParams] = useSearchParams()
  const { data, isLoading } = useGetCoursesQuery({
    search: searchParams.get('search') || undefined,
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    facultyDepartmentId: searchParams.get('facultyDepartmentId') || '',
    subjectId: searchParams.get('subjectId') || '',
    semester: (searchParams.get('semester') as any) || ''
  })

  const items = data?.data.data || []

  const { mutateAsync: createMutation, isPending: isCreating } = useCreateCourseMutation()
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteCourseMutation()
  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateCourseMutation()

  const handleDelete = (id: string) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa học phần này? Hành động này không thể hoàn tác.',
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
      title: 'Thêm học phần mới',
      description: 'Thêm học phần mới vào hệ thống',
      content: (
        <CourseForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleEdit = (item: Course) => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Chỉnh sửa học phần',
      description: 'Chỉnh sửa thông tin học phần đã tồn tại',
      content: (
        <CourseForm
          mode='edit'
          initialData={item}
          onSubmit={(formData) => handleFormSubmit(formData, 'edit', item.id)}
          isLoading={isUpdating}
        />
      )
    })
  }

  const handleFormSubmit = async (
    formData: CreateCourse | UpdateCourse,
    formMode: 'create' | 'edit',
    editingId?: string
  ) => {
    try {
      if (formMode === 'create') {
        await createMutation(formData as CreateCourse)
      } else if (formMode === 'edit' && editingId) {
        await updateMutation({ id: editingId, data: formData as UpdateCourse })
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
          <h1 className='text-3xl font-bold'>Quản lý học phần</h1>
          <p className='text-muted-foreground'>Quản lý danh sách các học phần trong hệ thống</p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={handleOpenCreate}>
            <Plus className='h-4 w-4 mr-2' />
            Thêm học phần
          </Button>
        </div>
      </div>

      <CourseFilters />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách học phần ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseTable data={items} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  )
}

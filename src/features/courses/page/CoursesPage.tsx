import { PaginationComponent } from '@/shared/components/Pagination'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import type { KyHoc } from '@/shared/lib/enum'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type { Course, CreateCourse, UpdateCourse } from '@/shared/validations/CourseSchema'
import { Plus } from 'lucide-react'
import {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useUpdateCourseMutation
} from '../api/CourseService'
import { CourseFilters, CourseForm, CourseTable } from '../components'

const CoursesPageComponent = () => {
  const dialogStore = useDialogStore()

  const { filters, resetFilters, setFilters } = useSearchParamsManager({
    page: '1',
    limit: '10',
    search: '',
    facultyDepartmentId: '',
    subjectId: '',
    semester: ''
  })

  const { data, isLoading, isFetching } = useGetCoursesQuery({
    ...filters,
    page: Number(filters.page),
    limit: Number(filters.limit),
    semester: filters.semester as KyHoc
  })

  const items = data?.data.data || []
  const meta = data?.data.meta

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
        await deleteMutation(id)
        dialogStore.closeDialog()
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
    if (formMode === 'create') {
      await createMutation(formData as CreateCourse)
    } else if (formMode === 'edit' && editingId) {
      await updateMutation({ id: editingId, data: formData as UpdateCourse })
    }
    dialogStore.closeDialog()
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

      <CourseFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách học phần ({meta?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseTable
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

export const CoursesPage = withPermissionGuard(CoursesPageComponent, PERMISSIONS.COURSES.LIST)

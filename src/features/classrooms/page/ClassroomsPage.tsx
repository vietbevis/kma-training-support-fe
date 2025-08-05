import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  Classroom,
  CreateClassroomSchemaType as CreateClassroom,
  UpdateClassroomSchemaType as UpdateClassroom
} from '@/shared/validations/ClassroomSchema'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router'
import {
  useCreateClassroomMutation,
  useDeleteClassroomMutation,
  useGetClassroomsQuery,
  useUpdateClassroomMutation
} from '../api/ClassroomService'
import { ClassroomFilters, ClassroomForm, ClassroomTable } from '../components'

export const ClassroomsPage = () => {
  const dialogStore = useDialogStore()

  const [searchParams] = useSearchParams()
  const { data, isLoading } = useGetClassroomsQuery({
    search: searchParams.get('search') || undefined,
    buildingId: searchParams.get('buildingId') || undefined,
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10
  })

  const classrooms = data?.data.data || []

  const { mutateAsync: createMutation, isPending: isCreating } = useCreateClassroomMutation()
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteClassroomMutation()
  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateClassroomMutation()

  const handleDelete = (id: string) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa phòng học này? Hành động này không thể hoàn tác.',
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
      title: 'Thêm phòng học mới',
      description: 'Thêm phòng học mới vào hệ thống',
      content: (
        <ClassroomForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleEdit = (classroom: Classroom) => {
    if (classroom) {
      dialogStore.openDialog({
        type: 'custom',
        title: 'Chỉnh sửa phòng học',
        description: 'Chỉnh sửa thông tin phòng học đã tồn tại',
        content: (
          <ClassroomForm
            mode='edit'
            initialData={classroom}
            onSubmit={(formData) => handleFormSubmit(formData, 'edit', classroom.id)}
            isLoading={isUpdating}
          />
        )
      })
    }
  }

  const handleFormSubmit = async (
    formData: CreateClassroom | UpdateClassroom,
    formMode: 'create' | 'edit',
    editingId?: string
  ) => {
    try {
      if (formMode === 'create') {
        await createMutation(formData as CreateClassroom)
      } else if (formMode === 'edit' && editingId) {
        await updateMutation({ id: editingId, data: formData as UpdateClassroom })
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
          <h1 className='text-3xl font-bold'>Quản lý phòng học</h1>
          <p className='text-muted-foreground'>Quản lý danh sách các phòng học trong hệ thống</p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={handleOpenCreate}>
            <Plus className='h-4 w-4 mr-2' />
            Thêm phòng học
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ClassroomFilters />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phòng học ({classrooms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ClassroomTable data={classrooms} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  )
}

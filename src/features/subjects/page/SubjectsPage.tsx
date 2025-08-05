import {
  useCreateSubjectMutation,
  useGetSubjectsQuery,
  useUpdateSubjectMutation
} from '@/features/subjects/api/SubjectService'
import { SubjectFilters, SubjectForm, SubjectTable } from '@/features/subjects/components'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  CreateSubjectSchemaType,
  SubjectSchemaType,
  UpdateSubjectSchemaType
} from '@/shared/validations/SubjectsSchema'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'

export const SubjectsPage = () => {
  const { openDialog, closeDialog } = useDialogStore()

  const [searchParams] = useSearchParams()
  const { data, isLoading } = useGetSubjectsQuery({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    search: searchParams.get('search') || '',
    facultyDepartmentId: searchParams.get('facultyDepartmentId') || ''
  })

  const subjects = data?.data.data || []

  const { mutateAsync: createSubject, isPending: isCreatingSubject } = useCreateSubjectMutation()
  const { mutateAsync: updateSubject, isPending: isUpdatingSubject } = useUpdateSubjectMutation()

  const handleDelete = (id: string) => {
    openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa bộ môn này? Hành động này không thể hoàn tác.',
      loading: false,
      onConfirm: () => {
        console.log('Delete subject with id:', id)
        toast.info('Chức năng này đang được phát triển')
        closeDialog()
      }
    })
  }

  const handleOpenCreate = () => {
    openDialog({
      type: 'custom',
      title: 'Thêm bộ môn mới',
      description: 'Thêm bộ môn mới vào hệ thống',
      content: (
        <SubjectForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreatingSubject}
        />
      )
    })
  }

  const handleEdit = (subject: SubjectSchemaType) => {
    openDialog({
      type: 'custom',
      title: 'Chỉnh sửa bộ môn',
      description: 'Chỉnh sửa thông tin bộ môn đã tồn tại',
      content: (
        <SubjectForm
          mode='edit'
          initialData={subject}
          onSubmit={(formData) => handleFormSubmit(formData, 'edit', subject.id)}
          isLoading={isUpdatingSubject}
        />
      )
    })
  }

  const handleFormSubmit = async (
    formData: CreateSubjectSchemaType | UpdateSubjectSchemaType,
    formMode: 'create' | 'edit',
    editingSubjectId?: string
  ) => {
    try {
      if (formMode === 'create') {
        await createSubject(formData as CreateSubjectSchemaType)
      } else if (formMode === 'edit' && editingSubjectId) {
        await updateSubject({ id: editingSubjectId, data: formData as UpdateSubjectSchemaType })
      }
      closeDialog()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Quản lý bộ môn</h1>
            <p className='text-muted-foreground'>Quản lý thông tin các bộ môn trong trường</p>
          </div>
          <Button onClick={handleOpenCreate} className='cursor-pointer'>
            <Plus className='mr-2 h-4 w-4' />
            Thêm bộ môn
          </Button>
        </div>

        <SubjectFilters />

        <Card>
          <CardHeader>
            <CardTitle>Danh sách bộ môn ({subjects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <SubjectTable subjects={subjects} onEdit={handleEdit} onDelete={handleDelete} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

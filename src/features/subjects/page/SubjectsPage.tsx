import {
  useCreateSubjectMutation,
  useGetSubjectsQuery,
  useUpdateSubjectMutation
} from '@/features/subjects/api/SubjectService'
import { SubjectFilters, SubjectForm, SubjectTable } from '@/features/subjects/components'
import { PaginationComponent } from '@/shared/components/Pagination'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  CreateSubjectSchemaType,
  SubjectSchemaType,
  UpdateSubjectSchemaType
} from '@/shared/validations/SubjectsSchema'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export const SubjectsPage = () => {
  const { openDialog, closeDialog } = useDialogStore()

  const { filters, resetFilters, setFilters } = useSearchParamsManager({
    page: '1',
    limit: '10',
    search: '',
    facultyDepartmentId: ''
  })
  const { data, isLoading, isFetching } = useGetSubjectsQuery({
    ...filters,
    page: Number(filters.page),
    limit: Number(filters.limit),
    facultyDepartmentId: filters.facultyDepartmentId || ''
  })

  const subjects = data?.data.data || []
  const meta = data?.data.meta

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
    if (formMode === 'create') {
      await createSubject(formData as CreateSubjectSchemaType)
    } else if (formMode === 'edit' && editingSubjectId) {
      await updateSubject({ id: editingSubjectId, data: formData as UpdateSubjectSchemaType })
    }
    closeDialog()
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

        <SubjectFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

        <Card>
          <CardHeader>
            <CardTitle>Danh sách bộ môn ({subjects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <SubjectTable
              subjects={subjects}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
              isFilterLoading={isFetching}
            />
          </CardContent>
        </Card>

        {meta && <PaginationComponent meta={meta} setFilter={setFilters} />}
      </div>
    </>
  )
}

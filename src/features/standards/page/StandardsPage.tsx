import { PaginationComponent } from '@/shared/components/Pagination'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import { useDialogStore } from '@/shared/stores/dialogStore'
import { FileUp } from 'lucide-react'
import { useDeleteStandardMutation, useGetStandardsQuery, useUpdateStandardMutation } from '../api/StandardService'
import { StandardFilters, StandardForm, StandardTable, StandardUploadForm } from '../components'

const StandardsPageComponent = () => {
  const { openDialog, closeDialog } = useDialogStore()

  const { filters, resetFilters, setFilters } = useSearchParamsManager({
    page: '',
    limit: '10',
    courseId: '',
    academicYearId: '',
    semester: '',
    startDate: '',
    endDate: '',
    className: ''
  })

  const { data, isLoading, isFetching } = useGetStandardsQuery(filters)

  const standards = data?.data.data || []
  const meta = data?.data.meta

  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteStandardMutation()
  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateStandardMutation()

  const handleDelete = (id: string) => {
    openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa quy chuẩn này? Hành động này không thể hoàn tác.',
      loading: isDeleting,
      onConfirm: async () => {
        await deleteMutation(id)
        closeDialog()
      }
    })
  }

  const handleEdit = (standard: any) => {
    openDialog({
      type: 'custom',
      title: 'Chỉnh sửa quy chuẩn',
      description: 'Chỉnh sửa thông tin quy chuẩn đã tồn tại',
      content: (
        <StandardForm
          initialData={standard}
          onSubmit={(formData) => handleFormSubmit(formData, standard.id)}
          isLoading={isUpdating}
        />
      ),
      className: 'w-5xl sm:max-w-5xl !max-h-[90vh] overflow-hidden overflow-y-auto'
    })
  }

  const handleFormSubmit = async (formData: any, editingStandardId: string) => {
    await updateMutation({ id: editingStandardId, data: formData })
    closeDialog()
  }

  const handleUploadWord = () => {
    openDialog({
      type: 'custom',
      title: 'Tải lên quy chuẩn từ Word',
      description: 'Tải lên file Word chứa thông tin quy chuẩn',
      content: (
        <StandardUploadForm
          onSubmit={() => {
            closeDialog()
          }}
        />
      )
    })
  }

  return (
    <>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Quản lý quy chuẩn dự kiến</h1>
            <p className='text-muted-foreground'>Quản lý danh sách quy chuẩn dự kiến trong hệ thống</p>
          </div>
          <div className='flex gap-2'>
            <PermissionButton onClick={handleUploadWord} requiredPermission={PERMISSIONS.STANDARDS.UPLOAD_WORD}>
              <FileUp className='h-4 w-4 mr-2' />
              Tải lên từ Word
            </PermissionButton>
          </div>
        </div>

        <StandardFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

        <Card>
          <CardHeader>
            <CardTitle>Danh sách quy chuẩn dự kiến {meta && `(${meta.total})`}</CardTitle>
          </CardHeader>
          <CardContent>
            <StandardTable
              data={standards}
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

// Apply permission guard
export const StandardsPage = withPermissionGuard(StandardsPageComponent, PERMISSIONS.STANDARDS.LIST)


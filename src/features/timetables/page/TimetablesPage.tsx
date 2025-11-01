import { PaginationComponent } from '@/shared/components/Pagination'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import { useDialogStore } from '@/shared/stores/dialogStore'
import { FileUp, Plus } from 'lucide-react'
import {
  useAddToStandardMutation,
  useDeleteTimetableMutation,
  useGetTimetablesQuery,
  useUpdateTimetableMutation
} from '../api/TimetableService'
import { TimetableFilters, TimetableForm, TimetableTable, TimetableUploadForm } from '../components'

// Use permission from constants

const TimetablesPageComponent = () => {
  const { openDialog, closeDialog } = useDialogStore()

  const { filters, resetFilters, setFilters } = useSearchParamsManager({
    page: '1',
    limit: '10',
    courseId: '',
    academicYearId: '',
    semester: '',
    startDate: '',
    endDate: '',
    className: ''
  })

  const { data, isLoading, isFetching } = useGetTimetablesQuery(filters)

  const timetables = data?.data.data || []
  const meta = data?.data.meta

  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteTimetableMutation()
  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateTimetableMutation()
  const { mutateAsync: addToStandardMutation, isPending: isAddingToStandard } = useAddToStandardMutation()

  const handleDelete = (id: string) => {
    openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa thời khóa biểu này? Hành động này không thể hoàn tác.',
      loading: isDeleting,
      onConfirm: async () => {
        await deleteMutation(id)
        closeDialog()
      }
    })
  }

  const handleEdit = (timetable: any) => {
    openDialog({
      type: 'custom',
      title: 'Chỉnh sửa thời khóa biểu',
      description: 'Chỉnh sửa thông tin thời khóa biểu đã tồn tại',
      content: (
        <TimetableForm
          initialData={timetable}
          onSubmit={(formData) => handleFormSubmit(formData, timetable.id)}
          isLoading={isUpdating}
        />
      ),
      className: 'w-5xl sm:max-w-5xl !max-h-[90vh] overflow-hidden overflow-y-auto'
    })
  }

  const handleFormSubmit = async (formData: any, editingTimetableId: string) => {
    await updateMutation({ id: editingTimetableId, data: formData })
    closeDialog()
  }

  const handleUploadExcel = () => {
    openDialog({
      type: 'custom',
      title: 'Tải lên thời khóa biểu từ Excel',
      description: 'Tải lên file Excel chứa thông tin thời khóa biểu',
      content: (
        <TimetableUploadForm
          onSubmit={() => {
            closeDialog()
          }}
        />
      )
    })
  }

  const handleAddToStandard = () => {
    openDialog({
      type: 'confirm',
      title: 'Xác nhận thêm vào quy chuẩn dự kiến',
      description: 'Bạn có chắc chắn muốn thêm thời khóa biểu vào quy chuẩn dự kiến không?',
      loading: isAddingToStandard,
      onConfirm: async () => {
        await addToStandardMutation()
        closeDialog()
      }
    })
  }

  return (
    <>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Quản lý thời khóa biểu</h1>
            <p className='text-muted-foreground'>Quản lý danh sách thời khóa biểu trong hệ thống</p>
          </div>
          <div className='flex gap-2'>
            <PermissionButton onClick={handleAddToStandard} requiredPermission={PERMISSIONS.TIMETABLES.UPLOAD_EXCEL}>
              <Plus className='h-4 w-4 mr-2' />
              Thêm vào quy chuẩn dự kiến
            </PermissionButton>
            <PermissionButton onClick={handleUploadExcel} requiredPermission={PERMISSIONS.TIMETABLES.UPLOAD_EXCEL}>
              <FileUp className='h-4 w-4 mr-2' />
              Tải lên từ Excel
            </PermissionButton>
          </div>
        </div>

        <TimetableFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

        <Card>
          <CardHeader>
            <CardTitle>Danh sách thời khóa biểu {meta && `(${meta.total})`}</CardTitle>
          </CardHeader>
          <CardContent>
            <TimetableTable
              data={timetables}
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
export const TimetablesPage = withPermissionGuard(TimetablesPageComponent, PERMISSIONS.TIMETABLES.LIST)

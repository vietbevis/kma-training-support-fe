import { PaginationComponent } from '@/shared/components/Pagination'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import ROUTES from '@/shared/lib/routes'
import { useDialogStore } from '@/shared/stores/dialogStore'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'
import {
  useAcademyApproveVisitingLecturerMutation,
  useAcademyRejectTrainningVisitingLecturerMutation,
  useAcademyRejectVisitingLecturerMutation,
  useDeleteVisitingLecturerMutation,
  useFacultyApproveVisitingLecturerMutation,
  useGetVisitingLecturersQuery,
  useTrainingApproveVisitingLecturerMutation,
  useTrainingRejectFacultyVisitingLecturerMutation
} from '../api/VisitingLecturerService'
import { VisitingLecturerFilters, VisitingLecturerTable } from '../components'

const VisitingLecturersPendingPageComponent = () => {
  const { filters, resetFilters, setFilters } = useSearchParamsManager({
    page: '1',
    limit: '10',
    search: '',
    facultyDepartmentId: '',
    subjectId: '',
    academicCredentialId: '',
    gender: '',
    areTeaching: '',
    trainingApproved: '',
    facultyApproved: '',
    academyApproved: 'false' // Set sẵn filter học viện chưa duyệt
  })

  const { data, isLoading, isFetching } = useGetVisitingLecturersQuery({
    ...filters,
    page: Number(filters.page),
    limit: Number(filters.limit),
    facultyDepartmentId: filters.facultyDepartmentId || '',
    subjectId: filters.subjectId || '',
    academicCredentialId: filters.academicCredentialId || '',
    gender: filters.gender || '',
    areTeaching: filters.areTeaching ? filters.areTeaching === 'true' : undefined,
    trainingApproved: filters.trainingApproved ? filters.trainingApproved === 'true' : undefined,
    facultyApproved: filters.facultyApproved ? filters.facultyApproved === 'true' : undefined,
    academyApproved: false // Force false cho trang này
  })

  const visitingLecturers = data?.data.data || []
  const meta = data?.data.meta

  const dialogStore = useDialogStore()
  const deleteVisitingLecturerMutation = useDeleteVisitingLecturerMutation()
  const trainingApproveMutation = useTrainingApproveVisitingLecturerMutation()
  const trainingRejectFacultyMutation = useTrainingRejectFacultyVisitingLecturerMutation()
  const facultyApproveMutation = useFacultyApproveVisitingLecturerMutation()
  const academyRejectMutation = useAcademyRejectVisitingLecturerMutation()
  const academyApproveMutation = useAcademyApproveVisitingLecturerMutation()
  const academyRejectTrainingMutation = useAcademyRejectTrainningVisitingLecturerMutation()

  const handleDelete = (id: string) => {
    const visitingLecturer = visitingLecturers.find((vl) => vl.id === id)
    if (!visitingLecturer) return

    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa giảng viên mời',
      description: `Bạn có chắc chắn muốn xóa giảng viên mời "${visitingLecturer.fullName}"? Hành động này không thể hoàn tác.`,
      loading: deleteVisitingLecturerMutation.isPending,
      onConfirm: async () => {
        dialogStore.setLoading?.(true)
        try {
          await deleteVisitingLecturerMutation.mutateAsync(id)
          dialogStore.closeDialog()
        } catch (error) {
          // Error đã được handle trong mutation
        } finally {
          dialogStore.setLoading?.(false)
        }
      }
    })
  }

  const handleTrainingApprove = (id: string, notes?: string) => {
    trainingApproveMutation.mutate({ id, data: { notes } })
  }

  const handleTrainingReject = (id: string, notes: string) => {
    academyRejectTrainingMutation.mutate({ id, data: { notes } })
  }

  const handleFacultyApprove = (id: string, notes?: string) => {
    facultyApproveMutation.mutate({ id, data: { notes } })
  }

  const handleFacultyReject = (id: string, notes: string) => {
    trainingRejectFacultyMutation.mutate({ id, data: { notes } })
  }

  const handleAcademyApprove = (id: string, notes?: string) => {
    academyApproveMutation.mutate({ id, data: { notes } })
  }

  const handleAcademyReject = (id: string, notes: string) => {
    academyRejectMutation.mutate({ id, data: { notes } })
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Danh sách chờ duyệt (Học viện chưa duyệt)</h1>
          <p className='text-muted-foreground'>
            Danh sách giảng viên mời đang chờ Học viện phê duyệt ({visitingLecturers.length} giảng viên mời)
          </p>
        </div>
        <PermissionButton
          asChild
          className='flex items-center gap-2'
          requiredPermission={PERMISSIONS.VISITING_LECTURERS?.CREATE || { method: 'POST', path: '/visiting-lecturers' }}
        >
          <Link to={ROUTES.VISITING_LECTURER_CREATE?.url || '/visiting-lecturers/create'}>
            <Plus className='h-4 w-4' />
            Thêm giảng viên mời mới
          </Link>
        </PermissionButton>
      </div>

      <VisitingLecturerFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} page='pending' />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách chờ duyệt (Học viện chưa duyệt) ({meta?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <VisitingLecturerTable
            data={visitingLecturers}
            isLoading={isLoading}
            isFilterLoading={isFetching}
            onDelete={handleDelete}
            onTrainingApprove={handleTrainingApprove}
            onTrainingReject={handleTrainingReject}
            onFacultyApprove={handleFacultyApprove}
            onFacultyReject={handleFacultyReject}
            onAcademyApprove={handleAcademyApprove}
            onAcademyReject={handleAcademyReject}
          />
        </CardContent>
      </Card>

      {meta && <PaginationComponent meta={meta} setFilter={setFilters} />}
    </div>
  )
}

// Apply permission guard
export const VisitingLecturersPendingPage = withPermissionGuard(
  VisitingLecturersPendingPageComponent,
  PERMISSIONS.VISITING_LECTURERS?.LIST || { method: 'GET', path: '/visiting-lecturers' }
)

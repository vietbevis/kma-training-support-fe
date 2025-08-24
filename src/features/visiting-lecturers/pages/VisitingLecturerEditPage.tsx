import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Button } from '@/shared/components/ui/button'
import { PERMISSIONS } from '@/shared/constants/permissions'
import ROUTES from '@/shared/lib/routes'
import type { UpdateVisitingLecturer } from '@/shared/validations/VisitingLecturerSchema'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { useGetVisitingLecturerDetailQuery, useUpdateVisitingLecturerMutation } from '../api/VisitingLecturerService'
import { VisitingLecturerForm } from '../components'

const VisitingLecturerEditPageComponent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: visitingLecturerResponse, isLoading } = useGetVisitingLecturerDetailQuery(id)
  const updateVisitingLecturerMutation = useUpdateVisitingLecturerMutation(id || '')

  const handleSubmit = async (data: UpdateVisitingLecturer) => {
    await updateVisitingLecturerMutation.mutateAsync(data)
    navigate(ROUTES.VISITING_LECTURERS?.url || '/visiting-lecturers')
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-8 absolute inset-0 bg-background/80 backdrop-blur-sm z-10'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!visitingLecturerResponse) {
    return (
      <>
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>Không tìm thấy giảng viên mời</p>
          <Button className='mt-4' asChild>
            <Link to={ROUTES.VISITING_LECTURERS?.url || '/visiting-lecturers'}>Quay lại danh sách</Link>
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon' asChild>
            <Link to={ROUTES.VISITING_LECTURERS?.url || '/visiting-lecturers'}>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Chỉnh sửa giảng viên mời</h1>
            <p className='text-muted-foreground'>
              Cập nhật thông tin giảng viên mời: {visitingLecturerResponse.data.fullName}
            </p>
          </div>
        </div>

        <VisitingLecturerForm
          mode='edit'
          visitingLecturer={visitingLecturerResponse.data}
          onSubmit={handleSubmit}
          isLoading={updateVisitingLecturerMutation.isPending}
        />
      </div>
    </>
  )
}

// Apply permission guard
export const VisitingLecturerEditPage = withPermissionGuard(
  VisitingLecturerEditPageComponent,
  PERMISSIONS.VISITING_LECTURERS?.UPDATE || { method: 'PUT', path: '/visiting-lecturers/:id' }
)

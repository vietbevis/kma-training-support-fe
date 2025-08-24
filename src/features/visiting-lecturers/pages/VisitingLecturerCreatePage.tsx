import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Button } from '@/shared/components/ui/button'
import { PERMISSIONS } from '@/shared/constants/permissions'
import ROUTES from '@/shared/lib/routes'
import type { CreateVisitingLecturer } from '@/shared/validations/VisitingLecturerSchema'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useCreateVisitingLecturerMutation } from '../api/VisitingLecturerService'
import { VisitingLecturerForm } from '../components'

const VisitingLecturerCreatePageComponent = () => {
  const createVisitingLecturerMutation = useCreateVisitingLecturerMutation()
  const navigate = useNavigate()

  const handleSubmit = async (data: CreateVisitingLecturer) => {
    await createVisitingLecturerMutation.mutateAsync(data)
    navigate(ROUTES.VISITING_LECTURERS?.url || '/visiting-lecturers')
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
            <h1 className='text-3xl font-bold tracking-tight'>Thêm giảng viên mời mới</h1>
            <p className='text-muted-foreground'>Điền thông tin để tạo hồ sơ giảng viên mời mới trong hệ thống</p>
          </div>
        </div>

        <VisitingLecturerForm
          mode='create'
          onSubmit={handleSubmit}
          isLoading={createVisitingLecturerMutation.isPending}
        />
      </div>
    </>
  )
}

// Apply permission guard
export const VisitingLecturerCreatePage = withPermissionGuard(
  VisitingLecturerCreatePageComponent,
  PERMISSIONS.VISITING_LECTURERS?.CREATE || { method: 'POST', path: '/visiting-lecturers' }
)

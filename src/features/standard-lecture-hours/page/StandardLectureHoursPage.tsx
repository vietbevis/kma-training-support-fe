import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { PERMISSIONS } from '@/shared/constants/permissions'
import {
  useGetStandardLectureHoursQuery,
  useUpdateStandardLectureHoursMutation
} from '../api/StandardLectureHoursService'
import { StandardLectureHoursForm } from '../components'

const StandardLectureHoursPageComponent = () => {
  const { data, isLoading } = useGetStandardLectureHoursQuery()
  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateStandardLectureHoursMutation()

  const standardLectureHours = data?.data

  const handleSubmit = async (formData: any) => {
    await updateMutation(formData)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Số tiết định mức</h1>
          <p className='text-muted-foreground'>Quản lý số tiết định mức giảng dạy trong hệ thống</p>
        </div>
      </div>

      <Card className='max-w-2xl mx-auto'>
        <CardHeader>
          <CardTitle>Thông tin số tiết định mức</CardTitle>
          <CardDescription>
            Cấu hình số tiết giảng dạy, số tiết vượt giờ và số tiết nghiên cứu khoa học định mức cho giảng viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-10 w-full' />
                </div>
              </div>
              <div className='flex justify-end'>
                <Skeleton className='h-10 w-24' />
              </div>
            </div>
          ) : (
            <StandardLectureHoursForm
              initialData={standardLectureHours}
              onSubmit={handleSubmit}
              isLoading={isUpdating}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export const StandardLectureHoursPage = withPermissionGuard(
  StandardLectureHoursPageComponent,
  PERMISSIONS.STANDARD_LECTURE_HOURS.VIEW
)

import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { useDialogStore } from '@/shared/stores/dialogStore'
import { format } from 'date-fns'
import { useGetTimetableDetailsByIdQuery } from '../api/TimetableClassroomService'

interface TimetableDetailsDialogProps {
  timetableId: string
}

const TimetableDetailsDialog = ({ timetableId }: TimetableDetailsDialogProps) => {
  const { data, isLoading } = useGetTimetableDetailsByIdQuery(timetableId)
  const { closeDialog } = useDialogStore()
  const timetable = data?.data

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <LoadingSpinner isLoading={true} />
      </div>
    )
  }

  if (!timetable) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg'>Không tìm thấy thông tin lớp học phần</div>
      </div>
    )
  }

  return (
    <div className='space-y-4 p-2'>
      <div className='space-y-2'>
        <div className='flex flex-wrap gap-2 justify-between mb-6'>
          <h3 className='text-xl font-semibold'>Lớp: {timetable.className}</h3>
          <Badge variant='outline'>{timetable.semester}</Badge>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-gray-500'>Thông tin chung</p>
            <table className='w-full mt-2'>
              <tbody>
                <tr>
                  <td className='py-1 pr-2 text-sm text-gray-600'>Học phần:</td>
                  <td className='py-1 text-sm font-medium'>
                    {timetable.course?.courseCode} - {timetable.course?.courseName}
                  </td>
                </tr>
                <tr>
                  <td className='py-1 pr-2 text-sm text-gray-600'>Năm học:</td>
                  <td className='py-1 text-sm font-medium'>{timetable.academicYear?.yearCode || '-'}</td>
                </tr>
                <tr>
                  <td className='py-1 pr-2 text-sm text-gray-600'>Loại lớp:</td>
                  <td className='py-1 text-sm font-medium'>{timetable.classType || '-'}</td>
                </tr>
                <tr>
                  <td className='py-1 pr-2 text-sm text-gray-600'>Giảng viên theo TKB:</td>
                  <td className='py-1 text-sm font-medium'>{timetable.lecturerName || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <p className='text-sm text-gray-500'>Thông tin chi tiết</p>
            <table className='w-full mt-2'>
              <tbody>
                <tr>
                  <td className='py-1 pr-2 text-sm text-gray-600'>Số sinh viên:</td>
                  <td className='py-1 text-sm font-medium'>{timetable.studentCount || '-'}</td>
                </tr>
                <tr>
                  <td className='py-1 pr-2 text-sm text-gray-600'>Thời gian:</td>
                  <td className='py-1 text-sm font-medium'>
                    {format(new Date(timetable.startDate), 'dd/MM/yyyy')} -{' '}
                    {format(new Date(timetable.endDate), 'dd/MM/yyyy')}
                  </td>
                </tr>
                <tr>
                  <td className='py-1 pr-2 text-sm text-gray-600'>Số tiết lý thuyết:</td>
                  <td className='py-1 text-sm font-medium'>{timetable.theoryHours || '-'}</td>
                </tr>
                <tr>
                  <td className='py-1 pr-2 text-sm text-gray-600'>Số tiết thực tế:</td>
                  <td className='py-1 text-sm font-medium'>{timetable.actualHours || '-'}</td>
                </tr>
                <tr>
                  <td className='py-1 pr-2 text-sm text-gray-600'>Số tín chỉ:</td>
                  <td className='py-1 text-sm font-medium'>{timetable.course?.credits || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='flex justify-end'>
        <Button variant='outline' onClick={closeDialog}>
          Đóng
        </Button>
      </div>
    </div>
  )
}

export default TimetableDetailsDialog

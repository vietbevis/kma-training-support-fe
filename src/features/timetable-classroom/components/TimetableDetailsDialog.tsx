import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { useDialogStore } from '@/shared/stores/dialogStore'
import { format } from 'date-fns'
import { BookOpen, Calendar, Clock, GraduationCap, User, Users } from 'lucide-react'
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
      <div className='flex items-center justify-center h-64 text-muted-foreground'>
        <div className='text-center space-y-2'>
          <BookOpen className='h-12 w-12 mx-auto opacity-50' />
          <div className='text-lg font-medium'>Không tìm thấy thông tin lớp học phần</div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 p-1'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-bold tracking-tight'>{timetable.className}</h2>
          <p className='text-sm text-muted-foreground'>
            {timetable.course?.courseCode} - {timetable.course?.courseName}
          </p>
        </div>
        <Badge variant='secondary' className='w-fit'>
          {timetable.semester}
        </Badge>
      </div>

      <Separator />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg flex items-center gap-2'>
              <BookOpen className='h-5 w-5 text-primary' />
              Thông tin chung
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-3'>
              <div className='flex items-start gap-4 justify-between py-2'>
                <span className='text-sm text-muted-foreground flex items-center gap-2 shrink-0'>
                  <BookOpen className='h-4 w-4' />
                  Học phần:
                </span>
                <span className='text-sm font-medium'>
                  {timetable.course?.courseCode + ' - ' + timetable.course?.courseName || '—'}
                </span>
              </div>
              <div className='flex items-start gap-4 justify-between py-2'>
                <span className='text-sm text-muted-foreground flex items-center gap-2 shrink-0'>
                  <Calendar className='h-4 w-4' />
                  Năm học:
                </span>
                <span className='text-sm font-medium'>{timetable.academicYear?.yearCode || '—'}</span>
              </div>
              <div className='flex items-start gap-4 justify-between py-2'>
                <span className='text-sm text-muted-foreground flex items-center gap-2 shrink-0'>
                  <GraduationCap className='h-4 w-4' />
                  Loại lớp:
                </span>
                <span className='text-sm font-medium'>{timetable.classType || '—'}</span>
              </div>
              <div className='flex items-start gap-4 justify-between py-2'>
                <span className='text-sm text-muted-foreground flex items-center gap-2 shrink-0'>
                  <User className='h-4 w-4' />
                  Giảng viên:
                </span>
                {timetable.lecturerName && (
                  <p className='text-sm font-medium flex flex-wrap'>
                    {timetable.lecturerName.split(/[;+]/).map((name) => (
                      <span key={name} title={name}>
                        {name}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Users className='h-5 w-5 text-primary' />
              Thông tin chi tiết
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-3'>
              <div className='flex items-start gap-4 justify-between py-2'>
                <span className='text-sm text-muted-foreground flex items-center gap-2 shrink-0'>
                  <Users className='h-4 w-4' />
                  Số sinh viên:
                </span>
                <span className='text-sm font-medium'>{timetable.studentCount || '—'}</span>
              </div>
              <div className='flex items-start gap-4 justify-between py-2'>
                <span className='text-sm text-muted-foreground flex items-center gap-2 shrink-0'>
                  <Calendar className='h-4 w-4' />
                  Thời gian:
                </span>
                <span className='text-sm font-medium'>
                  {format(new Date(timetable.startDate), 'dd/MM/yyyy')} -{' '}
                  {format(new Date(timetable.endDate), 'dd/MM/yyyy')}
                </span>
              </div>
              <div className='flex items-center justify-between py-2'>
                <span className='text-sm text-muted-foreground flex items-center gap-2 shrink-0'>
                  <Clock className='h-4 w-4' />
                  LL thực:
                </span>
                <span className='text-sm font-medium'>{timetable.actualHours || '—'}</span>
              </div>
              <div className='flex items-start gap-4 justify-between py-2'>
                <span className='text-sm text-muted-foreground flex items-center gap-2'>
                  <BookOpen className='h-4 w-4' />
                  Số tín chỉ:
                </span>
                <span className='text-sm font-medium'>{timetable.course?.credits || '—'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='flex justify-end pt-4 border-t'>
        <Button variant='outline' onClick={closeDialog} className='min-w-[100px] bg-transparent'>
          Đóng
        </Button>
      </div>
    </div>
  )
}

export default TimetableDetailsDialog

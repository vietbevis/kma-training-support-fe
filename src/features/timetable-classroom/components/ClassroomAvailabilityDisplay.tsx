import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDialogStore } from '@/shared/stores/dialogStore'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Building2, Calendar, Clock, Loader2, MapPin, Users } from 'lucide-react'
import type { Classroom, ClassroomAvailabilityResponse } from '../api/TimetableClassroomService'
import TimetableDetailsDialog from './TimetableDetailsDialog'

const DayOfWeekLabels = {
  1: 'Thứ 2',
  2: 'Thứ 3',
  3: 'Thứ 4',
  4: 'Thứ 5',
  5: 'Thứ 6',
  6: 'Thứ 7',
  0: 'Chủ nhật'
}

interface ClassroomAvailabilityDisplayProps {
  data?: ClassroomAvailabilityResponse
  isLoading: boolean
  date: string
  timeSlot?: string
}

const ClassroomAvailabilityDisplay = ({ data, isLoading, date, timeSlot }: ClassroomAvailabilityDisplayProps) => {
  const { openDialog } = useDialogStore()

  const handleClassroomClick = (classroom: Classroom) => {
    if (classroom.isOccupied && classroom.occupancyDetails) {
      openDialog({
        type: 'custom',
        title: `Chi tiết lớp tín chỉ - Phòng ${classroom.name}`,
        content: <TimetableDetailsDialog timetableId={classroom.occupancyDetails.timetableId} />,
        className: 'w-4xl sm:max-w-4xl max-h-[80vh]'
      })
    }
  }

  const getFloorNumber = (roomName: string): number => {
    const firstDigit = roomName.charAt(0)
    return Number.parseInt(firstDigit) || 0
  }

  const groupClassroomsByFloor = (classrooms: Classroom[]) => {
    const grouped = classrooms.reduce((acc, classroom) => {
      const floor = getFloorNumber(classroom.name)
      if (!acc[floor]) {
        acc[floor] = []
      }
      acc[floor].push(classroom)
      return acc
    }, {} as Record<number, Classroom[]>)

    // Sort floors numerically and sort rooms within each floor
    return Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)
      .map((floor) => ({
        floor,
        classrooms: grouped[floor].sort((a, b) => a.name.localeCompare(b.name))
      }))
  }

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-64 space-y-4'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
        <div className='text-lg font-medium text-gray-600'>Đang tải dữ liệu phòng học...</div>
        <div className='text-sm text-gray-400'>Vui lòng chờ trong giây lát</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className='flex flex-col items-center justify-center h-64 space-y-4'>
        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
          <Building2 className='h-8 w-8 text-gray-400' />
        </div>
        <div className='text-lg font-medium text-gray-600'>Không có dữ liệu phòng học</div>
        <div className='text-sm text-gray-400'>Vui lòng thử lại sau</div>
      </div>
    )
  }

  const formattedDate = format(new Date(date), 'EEEE, dd/MM/yyyy', { locale: vi })
  const timeSlotText = timeSlot ? `Tiết ${timeSlot}` : 'Tất cả các tiết'

  const floorGroups = groupClassroomsByFloor(data.classrooms)

  return (
    <div className='space-y-8'>
      {/* Header Section */}
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100'>
        <div className='flex items-center gap-3 mb-4'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>Tòa {data.building.name}</h2>
            <div className='flex items-center gap-4 text-gray-600 mt-1'>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                <span className='text-sm'>{formattedDate}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Clock className='h-4 w-4' />
                <span className='text-sm'>{timeSlotText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div className='bg-white rounded-lg p-4 border border-green-200 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-2xl font-bold text-green-600'>{data.summary.available}</p>
                <p className='text-sm text-green-700 font-medium'>Phòng trống</p>
              </div>
              <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg p-4 border border-red-200 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-2xl font-bold text-red-600'>{data.summary.occupied}</p>
                <p className='text-sm text-red-700 font-medium'>Phòng Đã có lớp học</p>
              </div>
              <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
                <Users className='h-5 w-5 text-red-500' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg p-4 border border-blue-200 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-2xl font-bold text-blue-600'>{data.summary.total}</p>
                <p className='text-sm text-blue-700 font-medium'>Tổng số phòng</p>
              </div>
              <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                <MapPin className='h-5 w-5 text-blue-500' />
              </div>
            </div>
          </div>
        </div>
      </div>

      {floorGroups.map(({ floor, classrooms }) => (
        <div key={floor} className='space-y-4'>
          {/* Floor Header */}
          <div className='flex items-center gap-3 pb-2 border-b border-gray-200'>
            <h3 className='text-xl font-semibold text-gray-900'>Tầng {floor}</h3>
            <p className='text-sm text-gray-600'>{classrooms.length} phòng học</p>
          </div>

          {/* Classroom Grid for this floor */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {classrooms.map((classroom) => (
              <Card
                key={classroom.id}
                className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                  classroom.isOccupied
                    ? 'border-red-200 hover:border-red-300 bg-gradient-to-br from-red-50 to-pink-50'
                    : 'border-green-200 hover:border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
                }`}
                onClick={() => handleClassroomClick(classroom)}
              >
                <CardHeader className='pb-3'>
                  <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-2'>
                      <div
                        className={`w-3 h-3 rounded-full ${classroom.isOccupied ? 'bg-red-500' : 'bg-green-500'}`}
                      ></div>
                      <CardTitle className='text-lg font-semibold text-gray-900'>Phòng {classroom.name}</CardTitle>
                    </div>
                    {classroom.isOccupied ? (
                      <Badge variant='destructive' className='shadow-sm'>
                        Đã có lớp học
                      </Badge>
                    ) : (
                      <Badge className='bg-green-500 hover:bg-green-600 text-white shadow-sm'>Trống</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className='pt-0 space-y-3'>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Building2 className='h-4 w-4' />
                    <span>{classroom.type}</span>
                  </div>

                  {classroom.description && (
                    <p className='text-sm text-gray-700 bg-white/50 rounded-md p-2 border'>{classroom.description}</p>
                  )}

                  {classroom.isOccupied && classroom.occupancyDetails && (
                    <div className='mt-4 p-3 bg-white/70 rounded-lg border border-red-100'>
                      <div className='text-xs font-medium text-red-700 mb-2 flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        Chi tiết sử dụng
                      </div>
                      <div className='space-y-2'>
                        <div className='flex justify-between items-center'>
                          <span className='text-xs text-gray-600'>Tiết học:</span>
                          <Badge variant='outline' className='text-xs h-5'>
                            {classroom.occupancyDetails.timeSlot}
                          </Badge>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='text-xs text-gray-600'>Thứ:</span>
                          <span className='text-xs font-medium text-gray-800'>
                            {
                              DayOfWeekLabels[
                                (classroom.occupancyDetails.dayOfWeek - 1) as keyof typeof DayOfWeekLabels
                              ]
                            }
                          </span>
                        </div>
                        <div className='text-xs text-gray-600 pt-1 border-t border-gray-200'>
                          <div className='flex justify-between'>
                            <span>Từ:</span>
                            <span className='font-medium'>
                              {format(new Date(classroom.occupancyDetails.startDate), 'dd/MM/yyyy')}
                            </span>
                          </div>
                          <div className='flex justify-between mt-1'>
                            <span>Đến:</span>
                            <span className='font-medium'>
                              {format(new Date(classroom.occupancyDetails.endDate), 'dd/MM/yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ClassroomAvailabilityDisplay

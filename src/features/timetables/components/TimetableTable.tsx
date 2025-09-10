import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { Badge } from '@/shared/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { formatDate } from 'date-fns'
import { Edit, Trash2 } from 'lucide-react'

interface TimetableType {
  id: string
  className: string
  semester: string
  classType: string
  studentCount: number
  theoryHours: number
  crowdClassCoefficient: number
  actualHours: number
  overtimeCoefficient: number
  standardHours: number
  startDate: string
  endDate: string
  lecturerName?: string
  detailTimeSlots: {
    dayOfWeek: number
    timeSlot: string
    roomName: string
    buildingName?: string
    startDate: string
    endDate: string
  }[]
  notes?: string
  courseId: string
  academicYearId: string
  createdAt: string
  updatedAt: string
}

interface TimetableTableProps {
  data: TimetableType[]
  isLoading: boolean
  onEdit: (timetable: TimetableType) => void
  onDelete: (id: string) => void
  isFilterLoading?: boolean
}

export const TimetableTable = ({ data, isLoading, onEdit, onDelete, isFilterLoading }: TimetableTableProps) => {
  const renderValue = (value: number | string) => {
    const num = Number(value)
    return num === 0 ? '-' : value
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <>
        <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu thời khóa biểu</div>
      </>
    )
  }

  return (
    <div className='relative'>
      {isFilterLoading && (
        <div className='absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex justify-center items-center'>
          <LoadingSpinner isLoading={true} className='relative py-20' />
        </div>
      )}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên lớp</TableHead>
              <TableHead>Kỳ học</TableHead>
              <TableHead>Giảng viên</TableHead>
              {/* <TableHead>CTĐT</TableHead> */}
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead>LL</TableHead>
              <TableHead>LL thực</TableHead>
              <TableHead>Số SV</TableHead>
              <TableHead>HS lớp đông</TableHead>
              <TableHead>HS T7/CN</TableHead>
              <TableHead>QC</TableHead>
              <TableHead className='text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((timetable) => (
              <TableRow key={timetable.id}>
                <TableCell>
                  <Badge variant='outline'>{timetable.className}</Badge>
                </TableCell>
                <TableCell>{timetable.semester}</TableCell>
                <TableCell>{timetable.lecturerName || '—'}</TableCell>
                <TableCell>{formatDate(new Date(timetable.startDate), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{formatDate(new Date(timetable.endDate), 'dd/MM/yyyy')}</TableCell>
                {/* Lên lớp */}
                <TableCell>{renderValue(timetable.theoryHours)}</TableCell>
                {/* Lên lớp thực */}
                <TableCell>{renderValue(timetable.actualHours)}</TableCell>
                {/* Số sinh viên */}
                <TableCell>{renderValue(timetable.studentCount)}</TableCell>
                {/* Hệ số đông */}
                <TableCell>{renderValue(timetable.crowdClassCoefficient)}</TableCell>
                {/* Hệ số ngoài giờ */}
                <TableCell>{renderValue(timetable.overtimeCoefficient)}</TableCell>
                {/* Quy chuẩn */}
                <TableCell>{renderValue(timetable.standardHours)}</TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <PermissionButton
                      variant='outline'
                      size='icon'
                      onClick={() => onEdit(timetable)}
                      requiredPermission={PERMISSIONS.TIMETABLES.UPDATE}
                    >
                      <Edit className='h-4 w-4' />
                    </PermissionButton>
                    <PermissionButton
                      variant='outline'
                      size='icon'
                      onClick={() => onDelete(timetable.id)}
                      requiredPermission={PERMISSIONS.TIMETABLES.DELETE}
                    >
                      <Trash2 className='h-4 w-4' />
                    </PermissionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

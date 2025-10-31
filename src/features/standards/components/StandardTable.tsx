import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { Badge } from '@/shared/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { formatDate } from 'date-fns'
import { Edit, Trash2 } from 'lucide-react'

export interface StandardType {
  id: string
  createdAt: string
  updatedAt: string
  className: string
  semester: string
  classType: string | null
  studentCount: number
  theoryHours: number
  crowdClassCoefficient: string
  actualHours: number
  overtimeCoefficient: string
  standardHours: string
  startDate: string | null
  endDate: string | null
  lecturerName: string
  course: Course | null
  academicYear: AcademicYear
}

export interface Course {
  id: string
  createdAt: string
  updatedAt: string
  courseCode: string
  courseName: string
  credits: number
  semester: string
  description: any
  facultyDepartment: any
}

export interface AcademicYear {
  id: string
  createdAt: string
  updatedAt: string
  yearCode: string
}

interface StandardTableProps {
  data: StandardType[]
  isLoading: boolean
  onEdit: (standard: StandardType) => void
  onDelete: (id: string) => void
  isFilterLoading?: boolean
}

export const StandardTable = ({ data, isLoading, onEdit, onDelete, isFilterLoading }: StandardTableProps) => {
  const renderValue = (value: number | string | null | undefined) => {
    if (value === null || value === undefined || value === '') return '—'
    const num = Number(value)
    return num === 0 ? '—' : value
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
        <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu quy chuẩn</div>
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
              <TableHead>Khoa</TableHead>
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
            {data.map((standard) => (
              <TableRow key={standard.id}>
                <TableCell>
                  <Badge variant='outline'>{standard.className}</Badge>
                </TableCell>
                <TableCell>{standard.semester}</TableCell>
                <TableCell>{standard.lecturerName || '—'}</TableCell>
                <TableCell>{standard.course?.facultyDepartment?.name || '—'}</TableCell>
                <TableCell>
                  {standard.startDate ? formatDate(new Date(standard.startDate), 'dd/MM/yyyy') : '—'}
                </TableCell>
                <TableCell>{standard.endDate ? formatDate(new Date(standard.endDate), 'dd/MM/yyyy') : '—'}</TableCell>
                {/* Lên lớp */}
                <TableCell>{renderValue(standard.theoryHours)}</TableCell>
                {/* Lên lớp thực */}
                <TableCell>{renderValue(standard.actualHours)}</TableCell>
                {/* Số sinh viên */}
                <TableCell>{renderValue(standard.studentCount)}</TableCell>
                {/* Hệ số đông */}
                <TableCell>{renderValue(standard.crowdClassCoefficient)}</TableCell>
                {/* Hệ số ngoài giờ */}
                <TableCell>{renderValue(standard.overtimeCoefficient)}</TableCell>
                {/* Quy chuẩn */}
                <TableCell>{renderValue(standard.standardHours)}</TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <PermissionButton
                      variant='outline'
                      size='icon'
                      onClick={() => onEdit(standard)}
                      requiredPermission={PERMISSIONS.STANDARDS.UPDATE}
                    >
                      <Edit className='h-4 w-4' />
                    </PermissionButton>
                    <PermissionButton
                      variant='outline'
                      size='icon'
                      onClick={() => onDelete(standard.id)}
                      requiredPermission={PERMISSIONS.STANDARDS.DELETE}
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

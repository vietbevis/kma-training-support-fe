import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { Badge } from '@/shared/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { PERMISSIONS } from '@/shared/constants/permissions'
import type { AcademicYearSchemaType } from '@/shared/validations/AcademicYearSchema'
import { Edit, Trash2 } from 'lucide-react'

interface AcademicYearTableProps {
  data: AcademicYearSchemaType[]
  isLoading: boolean
  onEdit: (academicYear: AcademicYearSchemaType) => void
  onDelete: (id: string) => void
  isFilterLoading?: boolean
}

export const AcademicYearTable = ({ data, isLoading, onEdit, onDelete, isFilterLoading }: AcademicYearTableProps) => {
  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu năm học</div>
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
              <TableHead>Mã năm học</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead className='text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((academicYear) => (
              <TableRow key={academicYear.id}>
                <TableCell>
                  <Badge variant='outline'>{academicYear.yearCode}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(academicYear.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell>
                  {new Date(academicYear.updatedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <PermissionButton
                      variant='outline'
                      size='icon'
                      onClick={() => onEdit(academicYear)}
                      requiredPermission={PERMISSIONS.ACADEMIC_YEARS.UPDATE}
                    >
                      <Edit className='h-4 w-4' />
                    </PermissionButton>
                    <PermissionButton
                      variant='outline'
                      size='icon'
                      onClick={() => onDelete(academicYear.id)}
                      requiredPermission={PERMISSIONS.ACADEMIC_YEARS.DELETE}
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

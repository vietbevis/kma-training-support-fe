import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import type { Course } from '@/shared/validations/CourseSchema'
import { Edit, Trash2 } from 'lucide-react'

interface CourseTableProps {
  data: Course[]
  isLoading: boolean
  onEdit: (item: Course) => void
  onDelete: (id: string) => void
  isFilterLoading?: boolean
}

const CourseTable = ({ data, isLoading, onEdit, onDelete, isFilterLoading }: CourseTableProps) => {
  if (isLoading && data.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!isLoading && data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu học phần</div>
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
              <TableHead>Mã học phần</TableHead>
              <TableHead>Tên học phần</TableHead>
              <TableHead>Tín chỉ</TableHead>
              <TableHead>Kỳ học</TableHead>
              <TableHead>Khoa</TableHead>
              <TableHead>Bộ môn</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead className='text-right w-20'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.courseCode}</TableCell>
                <TableCell>{item.courseName}</TableCell>
                <TableCell>{item.credits}</TableCell>
                <TableCell>{item.semester || <span className='text-muted-foreground'>Chưa cập nhật</span>}</TableCell>
                <TableCell>
                  {item.facultyDepartment?.name || <span className='text-muted-foreground'>Chưa cập nhật</span>}
                </TableCell>
                <TableCell>
                  {item.subject?.name || <span className='text-muted-foreground'>Chưa cập nhật</span>}
                </TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell>
                  {new Date(item.updatedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className='text-right w-20'>
                  <div className='flex justify-end gap-2'>
                    <Button variant='outline' size='icon' onClick={() => onEdit(item)}>
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' size='icon' onClick={() => onDelete(item.id)}>
                      <Trash2 className='h-4 w-4' />
                    </Button>
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

export default CourseTable

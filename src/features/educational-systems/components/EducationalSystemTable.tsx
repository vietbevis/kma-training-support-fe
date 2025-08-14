import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import type { EducationalSystem } from '@/shared/validations/EducationalSystemSchema'
import { Edit, Trash2 } from 'lucide-react'

interface EducationalSystemTableProps {
  data: EducationalSystem[]
  isLoading: boolean
  onEdit: (item: EducationalSystem) => void
  onDelete: (id: string) => void
  isFilterLoading?: boolean
}

const EducationalSystemTable = ({
  data,
  isLoading,
  onEdit,
  onDelete,
  isFilterLoading
}: EducationalSystemTableProps) => {
  if (isLoading && data.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!isLoading && data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu hệ đào tạo</div>
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
              <TableHead>Viết tắt</TableHead>
              <TableHead>Tên lớp</TableHead>
              <TableHead>Bậc đào tạo</TableHead>
              <TableHead>Học phí</TableHead>
              <TableHead>Đối tượng</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead className='text-right w-20'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.code}</TableCell>
                <TableCell>{item.nameClass}</TableCell>
                <TableCell>{item.educationLevels}</TableCell>
                <TableCell>{item.tuitions}</TableCell>
                <TableCell>{item.studentCategory}</TableCell>
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

export default EducationalSystemTable

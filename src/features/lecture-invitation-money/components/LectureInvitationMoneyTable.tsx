import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import type { LectureInvitationMoney } from '@/shared/validations/LectureInvitationMoneySchema'
import { Edit, Trash2 } from 'lucide-react'

interface LectureInvitationMoneyTableProps {
  data: LectureInvitationMoney[]
  isLoading: boolean
  onEdit: (item: LectureInvitationMoney) => void
  onDelete: (id: string) => void
}

const LectureInvitationMoneyTable = ({ data, isLoading, onEdit, onDelete }: LectureInvitationMoneyTableProps) => {
  if (isLoading && data.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!isLoading && data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu tiền mời giảng</div>
  }

  return (
    <div className='relative'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Số tiền</TableHead>
              <TableHead>Hệ đào tạo</TableHead>
              <TableHead>Học hàm/học vị</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead className='text-right w-20'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.money}</TableCell>
                <TableCell>{item.educationalSystem}</TableCell>
                <TableCell>{item.academicCredential?.name}</TableCell>
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

export default LectureInvitationMoneyTable

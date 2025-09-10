import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { formatCurrencyVND } from '@/shared/lib/utils'
import type { LectureInvitationMoney } from '@/shared/validations/LectureInvitationMoneySchema'
import { Edit, Trash2 } from 'lucide-react'

interface LectureInvitationMoneyTableProps {
  data: LectureInvitationMoney[]
  isLoading: boolean
  onEdit: (item: LectureInvitationMoney) => void
  onDelete: (id: string) => void
  isFilterLoading?: boolean
}

const LectureInvitationMoneyTable = ({
  data,
  isLoading,
  onEdit,
  onDelete,
  isFilterLoading
}: LectureInvitationMoneyTableProps) => {
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
      {isFilterLoading && (
        <div className='absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex justify-center items-center'>
          <LoadingSpinner isLoading={true} className='relative py-20' />
        </div>
      )}
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
                <TableCell className='font-medium'>{formatCurrencyVND(item.money)}</TableCell>
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
                    <PermissionButton
                      variant='outline'
                      size='icon'
                      onClick={() => onEdit(item)}
                      requiredPermission={PERMISSIONS.LECTURE_INVITATION_MONEY.UPDATE}
                    >
                      <Edit className='h-4 w-4' />
                    </PermissionButton>
                    <PermissionButton
                      variant='outline'
                      size='icon'
                      onClick={() => onDelete(item.id)}
                      requiredPermission={PERMISSIONS.LECTURE_INVITATION_MONEY.DELETE}
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

export default LectureInvitationMoneyTable

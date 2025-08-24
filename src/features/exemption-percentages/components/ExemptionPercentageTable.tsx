import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { PERMISSIONS } from '@/shared/constants/permissions'
import type { ExemptionPercentage } from '@/shared/validations/ExemptionPercentageSchema'
import { Edit, Trash2 } from 'lucide-react'

interface ExemptionPercentageTableProps {
  data: ExemptionPercentage[]
  isLoading: boolean
  onEdit: (exemptionPercentage: ExemptionPercentage) => void
  onDelete: (id: string) => void
  isFilterLoading?: boolean
}

const ExemptionPercentageTable = ({
  data,
  isLoading,
  onEdit,
  onDelete,
  isFilterLoading
}: ExemptionPercentageTableProps) => {
  if (isLoading && data.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!isLoading && data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu phần trăm miễn giảm</div>
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
              <TableHead>Lý do miễn giảm</TableHead>
              <TableHead>Phần trăm (%)</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead className='text-right w-20'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((exemptionPercentage) => (
              <TableRow key={exemptionPercentage.id}>
                <TableCell className='font-medium'>{exemptionPercentage.reason}</TableCell>
                <TableCell>
                  <span className='font-semibold text-blue-600'>{exemptionPercentage.percentage}%</span>
                </TableCell>
                <TableCell>
                  {new Date(exemptionPercentage.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell>
                  {new Date(exemptionPercentage.updatedAt).toLocaleDateString('vi-VN', {
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
                      onClick={() => onEdit(exemptionPercentage)}
                      requiredPermission={PERMISSIONS.EXEMPTION_PERCENTAGES.UPDATE}
                    >
                      <Edit className='h-4 w-4' />
                    </PermissionButton>
                    <PermissionButton
                      variant='outline'
                      size='icon'
                      onClick={() => onDelete(exemptionPercentage.id)}
                      requiredPermission={PERMISSIONS.EXEMPTION_PERCENTAGES.DELETE}
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

export default ExemptionPercentageTable

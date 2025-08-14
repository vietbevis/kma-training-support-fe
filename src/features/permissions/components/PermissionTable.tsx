import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { getMethodBadgeVariant } from '@/shared/lib/utils'
import type { PermissionType } from '@/shared/validations/PermissionSchema'
import { Edit } from 'lucide-react'

interface PermissionTableProps {
  permissions: PermissionType[]
  onEdit?: (permission: PermissionType) => void
  isLoading?: boolean
  isFilterLoading?: boolean
}

export const PermissionTable = ({ permissions, onEdit, isLoading, isFilterLoading }: PermissionTableProps) => {
  if (isLoading && permissions.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (permissions.length === 0) {
    return <div className='flex h-24 items-center justify-center text-muted-foreground'>Không có dữ liệu quyền nào</div>
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
              <TableHead>Phương thức</TableHead>
              <TableHead>Tên quyền</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Đường dẫn</TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell>
                  <Badge variant={getMethodBadgeVariant(permission.method)}>{permission.method}</Badge>
                </TableCell>
                <TableCell className='font-medium'>{permission.name}</TableCell>
                <TableCell className='max-w-[200px] truncate' title={permission.description}>
                  {permission.description || <span className='text-muted-foreground'>Không có mô tả</span>}
                </TableCell>
                <TableCell>
                  <code className='text-sm bg-muted px-2 py-1 rounded'>{permission.path}</code>
                </TableCell>
                <TableCell className='text-right w-20'>
                  <div className='flex justify-end gap-2'>
                    {onEdit && (
                      <Button variant='outline' size='icon' onClick={() => onEdit(permission)}>
                        <Edit className='h-4 w-4' />
                      </Button>
                    )}
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

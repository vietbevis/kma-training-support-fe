import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { Badge } from '@/shared/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { PERMISSIONS } from '@/shared/constants/permissions'
import type { RoleType } from '@/shared/validations/RoleSchema'
import { Copy, Edit, Trash2 } from 'lucide-react'

interface RoleTableProps {
  roles: RoleType[]
  onEdit?: (role: RoleType) => void
  onDelete?: (id: string) => void
  onDuplicate?: (role: RoleType) => void
  isLoading?: boolean
}

export const RoleTable = ({ roles, onEdit, onDelete, onDuplicate, isLoading }: RoleTableProps) => {
  if (isLoading && roles.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <div className='flex h-24 items-center justify-center text-muted-foreground'>Không có dữ liệu vai trò nào</div>
    )
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên vai trò</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Phạm vi</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className='w-[80px]'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className='font-medium'>{role.name}</TableCell>
              <TableCell className='max-w-[250px] truncate' title={role.description}>
                {role.description || <span className='text-muted-foreground'>Không có mô tả</span>}
              </TableCell>
              <TableCell>
                {role.scopeFacultyDepartment ? (
                  <div className='flex flex-col'>
                    <span className='font-medium'>{role.scopeFacultyDepartment.name}</span>
                    <span className='text-sm text-muted-foreground'>{role.scopeFacultyDepartment.code}</span>
                  </div>
                ) : (
                  <Badge variant='secondary'>Toàn hệ thống</Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={role.isSystemRole ? 'default' : 'outline'}>
                  {role.isSystemRole ? 'Hệ thống' : 'Tùy chỉnh'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={role.isActive ? 'default' : 'secondary'}>
                  {role.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
              </TableCell>
              <TableCell className='text-right'>
                <div className='flex justify-end gap-1'>
                  {onEdit && (
                    <PermissionButton
                      variant='outline'
                      size='icon'
                      onClick={() => onEdit(role)}
                      title='Chỉnh sửa'
                      requiredPermission={PERMISSIONS.ROLES.UPDATE}
                    >
                      <Edit className='h-4 w-4' />
                    </PermissionButton>
                  )}
                  {onDuplicate && (
                    <PermissionButton
                      variant='outline'
                      size='icon'
                      onClick={() => onDuplicate(role)}
                      title='Nhân bản'
                      requiredPermission={PERMISSIONS.ROLES.CREATE}
                    >
                      <Copy className='h-4 w-4' />
                    </PermissionButton>
                  )}
                  {onDelete && !role.isSystemRole && (
                    <PermissionButton
                      variant='outline'
                      size='icon'
                      onClick={() => onDelete(role.id)}
                      title='Xóa'
                      requiredPermission={PERMISSIONS.ROLES.DELETE}
                    >
                      <Trash2 className='h-4 w-4' />
                    </PermissionButton>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

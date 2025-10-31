import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { Badge } from '@/shared/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { BackupStatus } from '@/shared/lib/enum'
import { Download, RotateCcw, Trash2 } from 'lucide-react'
import { type BackupResponseType, getDownloadBackupUrl } from '../api/BackupService'

interface BackupTableProps {
  data: BackupResponseType[]
  isLoading: boolean
  onRestore: (backup: BackupResponseType) => void
  onDelete: (id: string) => void
  isFilterLoading?: boolean
}

export const BackupTable = ({ data, isLoading, onRestore, onDelete, isFilterLoading }: BackupTableProps) => {
  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu backup</div>
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    if (Number.isNaN(i)) return '—'
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case BackupStatus.COMPLETED:
        return <Badge className='bg-green-500'>Hoàn thành</Badge>
      case BackupStatus.FAILED:
        return <Badge className='bg-destructive'>Thất bại</Badge>
      case BackupStatus.PENDING:
        return <Badge className='bg-yellow-500'>Đang chờ</Badge>
      case BackupStatus.IN_PROGRESS:
        return <Badge className='bg-blue-500 animate-pulse'>Đang xử lý</Badge>
      case BackupStatus.RESTORED:
        return <Badge className='bg-purple-500'>Đã khôi phục</Badge>
      case BackupStatus.CANCELLED:
        return <Badge className='bg-gray-500'>Đã hủy</Badge>
      default:
        return <Badge>{status}</Badge>
    }
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
              <TableHead>Tên backup</TableHead>
              <TableHead>Kích thước</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày hoàn thành</TableHead>
              <TableHead className='text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((backup) => (
              <TableRow key={backup.id}>
                <TableCell>
                  <div className='font-medium'>{backup.name || 'Backup ' + formatDate(backup.createdAt)}</div>
                  {backup.description && <div className='text-sm text-muted-foreground'>{backup.description}</div>}
                </TableCell>
                <TableCell>{formatFileSize(backup.fileSize)}</TableCell>
                <TableCell>{getStatusBadge(backup.status)}</TableCell>
                <TableCell>
                  <Badge variant='outline'>{backup.type === 'manual' ? 'Thủ công' : 'Tự động'}</Badge>
                </TableCell>
                <TableCell>{formatDate(backup.createdAt)}</TableCell>
                <TableCell>{backup.completedAt ? formatDate(backup.completedAt) : '—'}</TableCell>
                <TableCell className='text-right space-x-1'>
                  {backup.status === BackupStatus.COMPLETED && (
                    <>
                      <PermissionButton
                        variant='outline'
                        size='icon'
                        requiredPermission={PERMISSIONS.BACKUPS.DOWNLOAD}
                        onClick={() => {
                          getDownloadBackupUrl(backup.id)
                        }}
                      >
                        <Download className='h-4 w-4' />
                      </PermissionButton>
                      <PermissionButton
                        variant='outline'
                        size='icon'
                        requiredPermission={PERMISSIONS.BACKUPS.RESTORE}
                        onClick={() => onRestore(backup)}
                      >
                        <RotateCcw className='h-4 w-4' />
                      </PermissionButton>
                    </>
                  )}
                  <PermissionButton
                    variant='outline'
                    size='icon'
                    requiredPermission={PERMISSIONS.BACKUPS.DELETE}
                    onClick={() => onDelete(backup.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </PermissionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

import { PermissionWrapper } from '@/shared/components/PermissionButton'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { getDownloadBackupUrl } from '../api/BackupService'

export default function BackupToast(backupId: string) {
  return (
    <div>
      <PermissionWrapper requiredPermission={PERMISSIONS.BACKUPS.DOWNLOAD}>
        <span
          className='text-blue-500 cursor-pointer hover:underline font-medium hover:text-blue-600'
          onClick={() => {
            getDownloadBackupUrl(backupId)
          }}
        >
          Tải xuống
        </span>
      </PermissionWrapper>
    </div>
  )
}

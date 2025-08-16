import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Badge } from '@/shared/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import ROUTES from '@/shared/lib/routes'
import { entityNameToEditPath } from '@/shared/lib/utils'
import type { AuditLog } from '@/shared/validations/AuditLogSchema'
import { useState } from 'react'
import { Link } from 'react-router'

interface AuditLogTableProps {
  data: AuditLog[]
  isLoading: boolean
  isFilterLoading?: boolean
}

const getActionVariant = (action: string) => {
  switch (action) {
    case 'CREATE':
      return 'default'
    case 'UPDATE':
      return 'secondary'
    case 'DELETE':
      return 'destructive'
    default:
      return 'outline'
  }
}

const getActionLabel = (action: string) => {
  switch (action) {
    case 'CREATE':
      return 'Tạo mới'
    case 'UPDATE':
      return 'Cập nhật'
    case 'DELETE':
      return 'Xóa'
    default:
      return action
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'SUCCESS':
      return 'default'
    case 'FAILED':
      return 'destructive'
    default:
      return 'outline'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'SUCCESS':
      return 'Thành công'
    case 'FAILED':
      return 'Thất bại'
    default:
      return status
  }
}

const getEntityLabel = (entityName: string) => {
  const entityMap: Record<string, string> = {
    UserEntity: 'Nhân viên',
    RoleEntity: 'Vai trò',
    PermissionEntity: 'Quyền',
    AcademicYearEntity: 'Năm học',
    BuildingEntity: 'Tòa nhà',
    ClassroomEntity: 'Phòng học',
    CourseEntity: 'Học phần',
    SubjectEntity: 'Bộ môn',
    FacultyDepartmentEntity: 'Khoa/Phòng ban',
    AcademicCredentialsEntity: 'Học hàm/học vị',
    EducationalSystemEntity: 'Hệ đào tạo',
    ExemptionPercentageEntity: 'Phần trăm miễn giảm',
    LectureInvitationMoneyEntity: 'Tiền mời giảng',
    StandardLectureHoursEntity: 'Số giờ định mức'
  }
  return entityMap[entityName] || entityName
}

const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '')
}

const ExpandableCell = ({
  content,
  maxLength = 100,
  isHtml = true
}: {
  content: string
  maxLength?: number
  isHtml?: boolean
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!content || content === 'Không có mô tả') {
    return <span className='text-muted-foreground'>Không có mô tả</span>
  }

  const plainText = isHtml ? stripHtmlTags(content) : content
  const shouldTruncate = plainText.length > maxLength

  if (!shouldTruncate) {
    return isHtml ? (
      <div className='whitespace-pre-wrap prose prose-sm' dangerouslySetInnerHTML={{ __html: content }} />
    ) : (
      <span>{content}</span>
    )
  }

  const displayContent = isExpanded ? content : `${plainText.substring(0, maxLength)}...`

  return (
    <div className='space-y-2 cursor-pointer' onClick={() => setIsExpanded(!isExpanded)}>
      {isHtml ? (
        <div className='whitespace-pre-wrap prose prose-sm' dangerouslySetInnerHTML={{ __html: displayContent }} />
      ) : (
        <span>{displayContent}</span>
      )}
    </div>
  )
}

export const AuditLogTable = ({ data, isLoading, isFilterLoading }: AuditLogTableProps) => {
  if (isLoading && data.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!isLoading && data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu audit log</div>
  }

  return (
    <div className='relative'>
      {/* Filter loading overlay */}
      {isFilterLoading && (
        <div className='absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex justify-center items-center'>
          <LoadingSpinner isLoading={true} className='relative py-20' />
        </div>
      )}

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thời gian</TableHead>
              <TableHead>Hành động</TableHead>
              <TableHead>Thực hiện bởi</TableHead>
              <TableHead>Tài nguyên ảnh hưởng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Địa chỉ IP</TableHead>
              <TableHead className='min-w-96'>Mô tả</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((log) => {
              const entityPath = entityNameToEditPath(log.entityName)

              const path = typeof entityPath === 'string' ? entityPath : entityPath(log.entityId)

              return (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getActionVariant(log.action)}>{getActionLabel(log.action)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Link to={ROUTES.USER_EDIT.getPath(log.user.id)}>
                      {log.user.code} - {log.user.fullName}
                      <p className='text-xs text-muted-foreground'>
                        <strong>Thuộc khoa/phòng ban:</strong> {log.user.facultyDepartment.name}
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline'>{getEntityLabel(log.entityName)}</Badge>
                    <p className='text-xs text-muted-foreground mt-2'>
                      <strong>Tại bản ghi:</strong>{' '}
                      <Link to={path} className='hover:underline'>
                        Click để xem
                      </Link>
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(log.status)}>{getStatusLabel(log.status)}</Badge>
                  </TableCell>
                  <TableCell>
                    <code className='text-sm bg-muted px-2 py-1 rounded'>{log.ipAddress}</code>
                  </TableCell>
                  <TableCell className='max-w-[300px]'>
                    <ExpandableCell content={log.description || ''} maxLength={100} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

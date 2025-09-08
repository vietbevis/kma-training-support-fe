import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { PermissionButton, PermissionWrapper } from '@/shared/components/PermissionButton'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { Switch } from '@/shared/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Textarea } from '@/shared/components/ui/textarea'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { Gender } from '@/shared/lib/enum'
import ROUTES from '@/shared/lib/routes'
import type { PermissionRequirement } from '@/shared/lib/utils'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type { VisitingLecturer } from '@/shared/validations/VisitingLecturerSchema'
import { AlertCircle, Edit, MessageSquare, Trash2 } from 'lucide-react'
import { Link } from 'react-router'

interface VisitingLecturerTableProps {
  data: VisitingLecturer[]
  isLoading: boolean
  isFilterLoading?: boolean
  onDelete: (id: string) => void
  onTrainingApprove: (id: string) => void
  onTrainingReject: (id: string, notes: string) => void
  onFacultyApprove: (id: string) => void
  onFacultyReject: (id: string, notes: string) => void
  onAcademyApprove: (id: string) => void
  onAcademyReject: (id: string, notes: string) => void
}

const getGenderLabel = (gender: Gender) => {
  switch (gender) {
    case Gender.MALE:
      return 'Nam'
    case Gender.FEMALE:
      return 'Nữ'
    default:
      return 'Không xác định'
  }
}

const getGenderVariant = (gender: Gender) => {
  switch (gender) {
    case Gender.MALE:
      return 'default'
    case Gender.FEMALE:
      return 'secondary'
    default:
      return 'outline'
  }
}

const getTeachingStatusVariant = (status: boolean) => {
  return status ? 'default' : 'secondary'
}

const ApprovalSwitch = ({
  isApproved,
  canApprove,
  canReject,
  rejectTitle,
  rejectDescription,
  onApprove,
  onReject,
  approvePermission,
  rejectPermission
}: {
  isApproved: boolean
  canApprove: boolean
  canReject: boolean
  rejectTitle: string
  rejectDescription: string
  onApprove: () => void
  onReject: (notes: string) => void
  approvePermission: PermissionRequirement
  rejectPermission?: PermissionRequirement
}) => {
  const { openDialog, closeDialog } = useDialogStore()

  const handleSwitchChange = (checked: boolean) => {
    if (checked && !isApproved) {
      // Duyệt - không cần ghi chú
      onApprove()
    } else if (!checked && isApproved && canReject) {
      // Bỏ duyệt - cần ghi chú, sử dụng dialogStore
      openDialog({
        type: 'custom',
        title: rejectTitle,
        description: rejectDescription,
        content: (
          <div className='space-y-4'>
            <div>
              <Label className='text-sm font-medium mb-1' htmlFor='reject-notes-input'>
                Ghi chú bỏ duyệt (bắt buộc)
              </Label>
              <Textarea
                id='reject-notes-input'
                placeholder='Nhập lý do bỏ duyệt...'
                rows={3}
                className='max-h-40'
                required
              />
            </div>
            <div className='flex justify-end'>
              <Button
                variant='destructive'
                onClick={() => {
                  const textarea = document.getElementById('reject-notes-input') as HTMLTextAreaElement
                  const notes = textarea?.value?.trim() || ''
                  if (notes) {
                    onReject(notes)
                    closeDialog()
                  } else {
                    textarea?.focus()
                    return // Không đóng dialog nếu chưa nhập ghi chú
                  }
                }}
              >
                Bỏ duyệt
              </Button>
            </div>
          </div>
        )
      })
    }
  }

  // Render switch với quyền approve
  if (canApprove) {
    return (
      <PermissionWrapper
        requiredPermission={approvePermission}
        fallback={
          <div className='flex items-center gap-2'>
            <Switch checked={isApproved} disabled />
            <span className='text-xs text-muted-foreground'>{isApproved ? 'Đã duyệt' : 'Chưa duyệt'}</span>
          </div>
        }
      >
        <div className='flex items-center gap-2'>
          <Switch checked={isApproved} onCheckedChange={handleSwitchChange} />
          <span className='text-xs text-muted-foreground'>{isApproved ? 'Đã duyệt' : 'Chưa duyệt'}</span>
        </div>
      </PermissionWrapper>
    )
  }

  // Render switch với quyền reject (khi không có quyền approve)
  else if (canReject && rejectPermission && isApproved) {
    return (
      <PermissionWrapper
        requiredPermission={rejectPermission}
        fallback={
          <div className='flex items-center gap-2'>
            <Switch checked={isApproved} disabled />
            <span className='text-xs text-muted-foreground'>{isApproved ? 'Đã duyệt' : 'Chưa duyệt'}</span>
          </div>
        }
      >
        <div className='flex items-center gap-2'>
          <Switch checked={isApproved} onCheckedChange={handleSwitchChange} />
          <span className='text-xs text-muted-foreground'>{isApproved ? 'Đã duyệt' : 'Chưa duyệt'}</span>
        </div>
      </PermissionWrapper>
    )
  }
  // Hiển thị trạng thái khi không có quyền
  else {
    return (
      <div className='flex items-center gap-2'>
        <Switch checked={isApproved} disabled />
        <span className='text-xs text-muted-foreground'>{isApproved ? 'Đã duyệt' : 'Chưa duyệt'}</span>
      </div>
    )
  }
}

export const VisitingLecturerTable = ({
  data,
  isLoading,
  isFilterLoading,
  onDelete,
  onTrainingApprove,
  onTrainingReject,
  onFacultyApprove,
  onFacultyReject,
  onAcademyApprove,
  onAcademyReject
}: VisitingLecturerTableProps) => {
  const { openDialog } = useDialogStore()

  if (isLoading && data.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!isLoading && data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu giảng viên mời</div>
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
              <TableHead>Họ và tên</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Khoa</TableHead>
              <TableHead>Trình độ</TableHead>
              <TableHead>Trạng thái giảng dạy</TableHead>
              <TableHead>Khoa duyệt</TableHead>
              <TableHead>Đào tạo duyệt</TableHead>
              <TableHead>Học viện duyệt</TableHead>
              <TableHead className='text-right w-32'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((visitingLecturer) => (
              <TableRow key={visitingLecturer.id}>
                <TableCell className='font-medium'>{visitingLecturer.fullName}</TableCell>
                <TableCell>
                  <Badge variant={getGenderVariant(visitingLecturer.gender)}>
                    {getGenderLabel(visitingLecturer.gender)}
                  </Badge>
                </TableCell>
                <TableCell>{visitingLecturer.email || 'Chưa có'}</TableCell>
                <TableCell>{visitingLecturer.phone || 'Chưa có'}</TableCell>
                <TableCell>{visitingLecturer.facultyDepartment?.name || 'Chưa có'}</TableCell>
                <TableCell>
                  <Badge variant='outline'>{visitingLecturer.academicCredential?.name || 'Chưa có'}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getTeachingStatusVariant(visitingLecturer.areTeaching)}>
                    {visitingLecturer.areTeaching ? 'Đang giảng dạy' : 'Không giảng dạy'}
                  </Badge>
                </TableCell>

                {/* Khoa duyệt */}
                <TableCell>
                  <ApprovalSwitch
                    isApproved={visitingLecturer.facultyApproved}
                    canApprove={!visitingLecturer.facultyApproved}
                    canReject={!visitingLecturer.trainingApproved} // Chỉ cho phép bỏ duyệt khi đào tạo chưa duyệt
                    rejectTitle='Bỏ duyệt khoa'
                    rejectDescription='Bạn có muốn bỏ duyệt khoa cho giảng viên mời này không?'
                    onApprove={() => onFacultyApprove(visitingLecturer.id)}
                    onReject={(notes) => onFacultyReject(visitingLecturer.id, notes)}
                    approvePermission={PERMISSIONS.VISITING_LECTURERS.FACULTY_APPROVE}
                    rejectPermission={PERMISSIONS.VISITING_LECTURERS.TRAINING_REJECT_FACULTY}
                  />
                </TableCell>

                {/* Đào tạo duyệt */}
                <TableCell>
                  <ApprovalSwitch
                    isApproved={visitingLecturer.trainingApproved}
                    canApprove={!visitingLecturer.trainingApproved}
                    canReject={!visitingLecturer.academyApproved} // Chỉ cho phép bỏ duyệt khi học viện chưa duyệt
                    rejectTitle='Bỏ duyệt đào tạo'
                    rejectDescription='Bạn có muốn bỏ duyệt đào tạo cho giảng viên mời này không?'
                    onApprove={() => onTrainingApprove(visitingLecturer.id)}
                    onReject={(notes) => onTrainingReject(visitingLecturer.id, notes)}
                    approvePermission={PERMISSIONS.VISITING_LECTURERS.TRAINING_APPROVE}
                    rejectPermission={PERMISSIONS.VISITING_LECTURERS.ACADEMY_REJECT_TRAINING}
                  />
                </TableCell>

                {/* Học viện duyệt */}
                <TableCell>
                  <ApprovalSwitch
                    isApproved={visitingLecturer.academyApproved}
                    canApprove={true}
                    canReject={true} // Học viện luôn có thể bỏ duyệt
                    rejectTitle='Bỏ duyệt học viện'
                    rejectDescription='Bạn có muốn bỏ duyệt học viện cho giảng viên mời này không?'
                    onApprove={() => onAcademyApprove(visitingLecturer.id)}
                    onReject={(notes) => onAcademyReject(visitingLecturer.id, notes)}
                    approvePermission={PERMISSIONS.VISITING_LECTURERS.ACADEMY_APPROVE}
                    rejectPermission={PERMISSIONS.VISITING_LECTURERS.ACADEMY_REJECT}
                  />
                </TableCell>

                <TableCell className='text-right w-32'>
                  <div className='flex justify-end gap-2'>
                    {visitingLecturer.notes && visitingLecturer.notes.trim() !== '' && (
                      <Button
                        variant='outline'
                        size='icon'
                        className='cursor-pointer text-orange-600 hover:text-orange-700'
                        title='Xem lý do từ chối'
                        onClick={() =>
                          openDialog({
                            type: 'custom',
                            title: 'Lý do từ chối',
                            content: (
                              <Alert>
                                <AlertCircle className='h-4 w-4' />
                                <AlertDescription className='whitespace-pre-wrap'>
                                  {visitingLecturer.notes || 'Không có ghi chú'}
                                </AlertDescription>
                              </Alert>
                            )
                          })
                        }
                      >
                        <MessageSquare className='h-3 w-3' />
                      </Button>
                    )}
                    <PermissionButton
                      variant='outline'
                      size='icon'
                      asChild
                      requiredPermission={
                        PERMISSIONS.VISITING_LECTURERS?.UPDATE || { method: 'PUT', path: '/visiting-lecturers/:id' }
                      }
                    >
                      <Link
                        to={
                          ROUTES.VISITING_LECTURER_EDIT?.url?.replace(':id', visitingLecturer.id) ||
                          `/visiting-lecturers/${visitingLecturer.id}/edit`
                        }
                      >
                        <Edit className='h-4 w-4' />
                      </Link>
                    </PermissionButton>
                    <PermissionButton
                      variant='outline'
                      size='icon'
                      onClick={() => onDelete(visitingLecturer.id)}
                      requiredPermission={
                        PERMISSIONS.VISITING_LECTURERS?.DELETE || {
                          method: 'DELETE',
                          path: '/visiting-lecturers/:id/hard'
                        }
                      }
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

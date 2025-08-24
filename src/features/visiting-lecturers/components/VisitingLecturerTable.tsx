import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Textarea } from '@/shared/components/ui/textarea'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { Gender } from '@/shared/lib/enum'
import ROUTES from '@/shared/lib/routes'
import type { PermissionRequirement } from '@/shared/lib/utils'
import type { VisitingLecturer } from '@/shared/validations/VisitingLecturerSchema'
import { AlertCircle, Check, Edit, MessageSquare, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

interface VisitingLecturerTableProps {
  data: VisitingLecturer[]
  isLoading: boolean
  isFilterLoading?: boolean
  onDelete: (id: string) => void
  onTrainingApprove: (id: string, notes?: string) => void
  onTrainingReject: (id: string, notes: string) => void
  onFacultyApprove: (id: string, notes?: string) => void
  onFacultyReject: (id: string, notes: string) => void
  onAcademyApprove: (id: string, notes?: string) => void
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

const NotesDialog = ({ notes, title, children }: { notes: string; title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Lý do từ chối/bỏ duyệt:</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <Alert>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='whitespace-pre-wrap'>{notes || 'Không có ghi chú'}</AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button type='button' onClick={() => setIsOpen(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const ApprovalDialog = ({
  title,
  description,
  onApprove,
  onReject,
  showApprove = true,
  showReject = true,
  requireNotesForReject = true,
  children
}: {
  title: string
  description: string
  onApprove?: (notes?: string) => void
  onReject?: (notes: string) => void
  showApprove?: boolean
  showReject?: boolean
  requireNotesForReject?: boolean
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [notes, setNotes] = useState('')

  const handleApprove = () => {
    onApprove?.(notes || undefined)
    setIsOpen(false)
    setNotes('')
  }

  const handleReject = () => {
    if (requireNotesForReject && !notes.trim()) {
      return // Không cho phép reject mà không có ghi chú
    }
    onReject?.(notes)
    setIsOpen(false)
    setNotes('')
  }

  const handleClose = () => {
    setIsOpen(false)
    setNotes('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          {(showReject || showApprove) && (
            <div>
              <label className='text-sm font-medium'>
                Ghi chú {requireNotesForReject && showReject && '(bắt buộc khi từ chối)'}
              </label>
              <Textarea
                placeholder={
                  requireNotesForReject && showReject ? 'Nhập ghi chú (bắt buộc khi từ chối)...' : 'Nhập ghi chú...'
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={handleClose}>
            Hủy
          </Button>
          {showReject && (
            <Button
              type='button'
              variant='destructive'
              onClick={handleReject}
              disabled={requireNotesForReject && !notes.trim()}
            >
              {showApprove ? 'Từ chối' : 'Bỏ duyệt'}
              <X className='h-4 w-4' />
            </Button>
          )}
          {showApprove && (
            <Button type='button' onClick={handleApprove}>
              Duyệt
              <Check className='h-4 w-4' />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const ApprovalCell = ({
  isApproved,
  canApprove,
  canReject,
  approveTitle,
  rejectTitle,
  approveDescription,
  rejectDescription,
  onApprove,
  onReject,
  approvePermission,
  rejectPermission
}: {
  isApproved: boolean
  canApprove: boolean
  canReject: boolean
  approveTitle: string
  rejectTitle: string
  approveDescription: string
  rejectDescription: string
  onApprove: (notes?: string) => void
  onReject: (notes: string) => void
  approvePermission: PermissionRequirement
  rejectPermission?: PermissionRequirement
}) => {
  return (
    <div className='flex items-center gap-1'>
      {/* Nút duyệt/hiển thị trạng thái */}
      {canApprove && (
        <PermissionButton
          variant='ghost'
          size='icon'
          className='cursor-pointer'
          title={approveTitle}
          requiredPermission={approvePermission}
          fallback={
            <Button variant='ghost' size='icon' className='cursor-not-allowed' disabled>
              {isApproved ? <Check className='h-3 w-3 text-green-500' /> : <X className='h-3 w-3 text-gray-400' />}
            </Button>
          }
        >
          <ApprovalDialog
            title={approveTitle}
            description={approveDescription}
            onApprove={onApprove}
            onReject={onReject}
            showApprove={!isApproved}
            showReject={false}
          >
            <Button variant='ghost' size='icon' className='cursor-pointer'>
              {isApproved ? <Check className='h-3 w-3 text-green-500' /> : <X className='h-3 w-3 text-gray-400' />}
            </Button>
          </ApprovalDialog>
        </PermissionButton>
      )}

      {/* Nút bỏ duyệt (chỉ hiện khi đã được duyệt và có quyền) */}
      {isApproved && canReject && rejectPermission && (
        <PermissionButton
          variant='ghost'
          size='icon'
          className='cursor-pointer'
          title={rejectTitle}
          requiredPermission={rejectPermission}
        >
          <ApprovalDialog
            title={rejectTitle}
            description={rejectDescription}
            onReject={onReject}
            showApprove={false}
            showReject={true}
            requireNotesForReject={true}
          >
            <Button variant='ghost' size='icon' className='cursor-pointer'>
              <Check className='h-3 w-3 text-green-500' />
            </Button>
          </ApprovalDialog>
        </PermissionButton>
      )}

      {/* Hiển thị trạng thái khi không có quyền */}
      {!canApprove && (
        <Button variant='ghost' size='icon' className='cursor-not-allowed' disabled>
          {isApproved ? <Check className='h-3 w-3 text-green-500' /> : <X className='h-3 w-3 text-gray-400' />}
        </Button>
      )}
    </div>
  )
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

                {/* Khoa duyệt - Khoa chỉ có thể duyệt */}
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <ApprovalCell
                      isApproved={visitingLecturer.facultyApproved}
                      canApprove={true}
                      canReject={false}
                      approveTitle='Khoa duyệt giảng viên mời'
                      rejectTitle=''
                      approveDescription='Bạn có muốn duyệt giảng viên mời này không?'
                      rejectDescription=''
                      onApprove={(notes) => onFacultyApprove(visitingLecturer.id, notes)}
                      onReject={(notes) => onFacultyReject(visitingLecturer.id, notes)}
                      approvePermission={PERMISSIONS.VISITING_LECTURERS.FACULTY_APPROVE}
                    />
                    {/* Đào tạo bỏ duyệt khoa (chỉ hiện khi khoa đã duyệt và đào tạo chưa duyệt) */}
                    {visitingLecturer.facultyApproved && !visitingLecturer.trainingApproved && (
                      <PermissionButton
                        variant='ghost'
                        size='icon'
                        className='cursor-pointer ml-1'
                        title='Đào tạo bỏ duyệt khoa'
                        requiredPermission={PERMISSIONS.VISITING_LECTURERS.TRAINING_REJECT_FACULTY}
                      >
                        <ApprovalDialog
                          title='Đào tạo bỏ duyệt khoa'
                          description='Bạn có muốn bỏ duyệt khoa cho giảng viên mời này không?'
                          onReject={(notes) => onFacultyReject(visitingLecturer.id, notes)}
                          showApprove={false}
                          showReject={true}
                          requireNotesForReject={true}
                        >
                          <Button variant='ghost' size='icon' className='cursor-pointer'>
                            <X className='h-3 w-3 text-red-500' />
                          </Button>
                        </ApprovalDialog>
                      </PermissionButton>
                    )}
                  </div>
                </TableCell>

                {/* Đào tạo duyệt - Đào tạo có thể duyệt của đào tạo hoặc bỏ duyệt của khoa */}
                <TableCell>
                  <div className='flex items-center gap-1'>
                    {/* Duyệt đào tạo */}
                    <ApprovalCell
                      isApproved={visitingLecturer.trainingApproved}
                      canApprove={true}
                      canReject={false}
                      approveTitle='Đào tạo duyệt giảng viên mời'
                      rejectTitle=''
                      approveDescription='Bạn có muốn duyệt giảng viên mời này không?'
                      rejectDescription=''
                      onApprove={(notes) => onTrainingApprove(visitingLecturer.id, notes)}
                      onReject={(notes) => onTrainingReject(visitingLecturer.id, notes)}
                      approvePermission={PERMISSIONS.VISITING_LECTURERS.TRAINING_APPROVE}
                    />
                    {/* Học viện bỏ duyệt đào tạo (chỉ hiện khi đào tạo đã duyệt) */}
                    {visitingLecturer.trainingApproved && (
                      <PermissionButton
                        variant='ghost'
                        size='icon'
                        className='cursor-pointer ml-1'
                        title='Học viện bỏ duyệt đào tạo'
                        requiredPermission={PERMISSIONS.VISITING_LECTURERS.ACADEMY_REJECT_TRAINING}
                      >
                        <ApprovalDialog
                          title='Học viện bỏ duyệt đào tạo'
                          description='Bạn có muốn bỏ duyệt đào tạo cho giảng viên mời này không?'
                          onReject={(notes) => onTrainingReject(visitingLecturer.id, notes)}
                          showApprove={false}
                          showReject={true}
                          requireNotesForReject={true}
                        >
                          <Button variant='ghost' size='icon' className='cursor-pointer'>
                            <X className='h-3 w-3 text-red-500' />
                          </Button>
                        </ApprovalDialog>
                      </PermissionButton>
                    )}
                  </div>
                </TableCell>

                {/* Học viện duyệt - Học viện có thể duyệt/bỏ duyệt của học viện và bỏ duyệt của đào tạo */}
                <TableCell>
                  {/* Duyệt học viện */}
                  <ApprovalCell
                    isApproved={visitingLecturer.academyApproved}
                    canApprove={true}
                    canReject={visitingLecturer.academyApproved}
                    approveTitle='Học viện duyệt giảng viên mời'
                    rejectTitle='Học viện bỏ duyệt'
                    approveDescription='Bạn có muốn duyệt giảng viên mời này không?'
                    rejectDescription='Bạn có muốn bỏ duyệt học viện cho giảng viên mời này không?'
                    onApprove={(notes) => onAcademyApprove(visitingLecturer.id, notes)}
                    onReject={(notes) => onAcademyReject(visitingLecturer.id, notes)}
                    approvePermission={PERMISSIONS.VISITING_LECTURERS.ACADEMY_APPROVE}
                    rejectPermission={PERMISSIONS.VISITING_LECTURERS.ACADEMY_REJECT}
                  />
                </TableCell>

                <TableCell className='text-right w-32'>
                  <div className='flex justify-end gap-2'>
                    {visitingLecturer.notes && visitingLecturer.notes.trim() !== '' && (
                      <NotesDialog notes={visitingLecturer.notes} title='Lý do từ chối'>
                        <Button
                          variant='outline'
                          size='icon'
                          className='cursor-pointer text-orange-600 hover:text-orange-700'
                          title='Xem lý do từ chối'
                        >
                          <MessageSquare className='h-3 w-3' />
                        </Button>
                      </NotesDialog>
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

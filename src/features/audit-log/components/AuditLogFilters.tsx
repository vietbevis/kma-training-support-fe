import { ComboboxUser } from '@/features/users/components/ComboboxUser'
import { Button } from '@/shared/components/ui/button'
import {
  DateField,
  DateFieldDays,
  DateFieldMonths,
  DateFieldSeparator,
  DateFieldYears
} from '@/shared/components/ui/date-field'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { X } from 'lucide-react'

const actionOptions = [
  { value: 'CREATE', label: 'Tạo mới' },
  { value: 'UPDATE', label: 'Cập nhật' },
  { value: 'DELETE', label: 'Xóa' },
  { value: 'SOFT_DELETE', label: 'Xóa mềm' },
  { value: 'RESTORE', label: 'Khôi phục' },
  { value: 'LOGIN', label: 'Đăng nhập' },
  { value: 'LOGOUT', label: 'Đăng xuất' },
  { value: 'FAILED_LOGIN', label: 'Đăng nhập thất bại' },
  { value: 'PASSWORD_CHANGE', label: 'Đổi mật khẩu' },
  { value: 'PERMISSION_CHANGE', label: 'Thay đổi quyền' },
  { value: 'EXPORT', label: 'Xuất dữ liệu' },
  { value: 'IMPORT', label: 'Nhập dữ liệu' },
  { value: 'VIEW', label: 'Xem' },
  { value: 'DOWNLOAD', label: 'Tải xuống' },
  { value: 'UPLOAD', label: 'Tải lên' },
  { value: 'CUSTOM', label: 'Tùy chỉnh' }
]

const entityOptions = [
  { value: 'UserEntity', label: 'Người dùng' },
  { value: 'RoleEntity', label: 'Vai trò' },
  { value: 'PermissionEntity', label: 'Quyền' },
  { value: 'AcademicYearEntity', label: 'Năm học' },
  { value: 'BuildingEntity', label: 'Tòa nhà' },
  { value: 'ClassroomEntity', label: 'Phòng học' },
  { value: 'CourseEntity', label: 'Khóa học' },
  { value: 'SubjectEntity', label: 'Môn học' },
  { value: 'FacultyDepartmentEntity', label: 'Khoa/Bộ môn' },
  { value: 'AcademicCredentialEntity', label: 'Học hàm/học vị' },
  { value: 'EducationalSystemEntity', label: 'Hệ đào tạo' },
  { value: 'ExemptionPercentageEntity', label: 'Phần trăm miễn giảm' },
  { value: 'LectureInvitationMoneyEntity', label: 'Tiền mời giảng' }
]

interface AuditLogFiltersProps {
  filters: {
    page: string
    limit: string
    userId: string
    action: string
    entityName: string
    fromDate: string
    toDate: string
  }
  setFilter: (key: keyof AuditLogFiltersProps['filters'], value: string) => void
  resetFilters: () => void
}

export const AuditLogFilters = ({ filters, setFilter, resetFilters }: AuditLogFiltersProps) => {
  const handleDateChange = (field: 'fromDate' | 'toDate', value: Date | null) => {
    setFilter(field, value ? value.toISOString().split('T')[0] : '')
  }

  return (
    <div className='flex flex-wrap items-end gap-4'>
      {/* User Filter */}
      <div className='space-y-2 min-w-72'>
        <Label htmlFor='userId'>Người thực hiện</Label>
        <ComboboxUser
          value={filters.userId}
          onValueChange={(value) => setFilter('userId', value)}
          placeholder='Chọn người thực hiện...'
          width='100%'
        />
      </div>

      {/* Action Filter */}
      <div className='space-y-2 w-40'>
        <Label htmlFor='action'>Hành động</Label>
        <Select value={filters.action} onValueChange={(value) => setFilter('action', value === 'all' ? '' : value)}>
          <SelectTrigger id='action' className='w-full'>
            <SelectValue placeholder='Chọn hành động' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả hành động</SelectItem>
            {actionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Entity Filter */}
      <div className='space-y-2 min-w-40'>
        <Label htmlFor='entityName'>Thực thể</Label>
        <Select
          value={filters.entityName}
          onValueChange={(value) => setFilter('entityName', value === 'all' ? '' : value)}
        >
          <SelectTrigger id='entityName' className='w-full'>
            <SelectValue placeholder='Chọn thực thể' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả thực thể</SelectItem>
            {entityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* From Date */}
      <div className='space-y-2'>
        <Label htmlFor='fromDate'>Từ ngày</Label>
        <DateField
          value={filters.fromDate ? new Date(filters.fromDate) : null}
          onValueChange={(value) => handleDateChange('fromDate', value)}
        >
          <DateFieldDays placeholder='dd' />
          <DateFieldSeparator />
          <DateFieldMonths placeholder='mm' />
          <DateFieldSeparator />
          <DateFieldYears placeholder='yyyy' />
        </DateField>
      </div>

      {/* To Date */}
      <div className='space-y-2'>
        <Label htmlFor='toDate'>Đến ngày</Label>
        <DateField
          value={filters.toDate ? new Date(filters.toDate) : null}
          onValueChange={(value) => handleDateChange('toDate', value)}
        >
          <DateFieldDays placeholder='dd' />
          <DateFieldSeparator />
          <DateFieldMonths placeholder='mm' />
          <DateFieldSeparator />
          <DateFieldYears placeholder='yyyy' />
        </DateField>
      </div>

      {/* Clear Filters */}
      <div>
        <Button variant='outline' onClick={resetFilters} className='w-full flex items-center gap-2'>
          <X className='h-4 w-4' />
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  )
}

import ComboboxFacultyDepartment from '@/features/faculty-departments/components/ComboboxFacultyDepartment'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useDebounceSearchParams } from '@/shared/hooks/useDebounceSearchParams'
import { Search, X } from 'lucide-react'

export const RoleFilters = () => {
  const [searchParams, setSearchParams] = useDebounceSearchParams()

  return (
    <div className='flex items-center gap-4 flex-wrap'>
      <div className='flex-1 max-w-sm'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm kiếm theo tên vai trò...'
            value={searchParams.get('search') || ''}
            onChange={(e) => setSearchParams({ search: e.target.value, page: '1' })}
            className='pl-10'
          />
        </div>
      </div>

      <div className='max-w-xs'>
        <Select
          value={searchParams.get('isActive') || 'all'}
          onValueChange={(value) =>
            setSearchParams((prev) => {
              const params = new URLSearchParams(prev)
              params.set('page', '1')
              if (value === 'all') {
                params.delete('isActive')
              } else {
                params.set('isActive', value)
              }
              return params
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Trạng thái</SelectItem>
            <SelectItem value='true'>Hoạt động</SelectItem>
            <SelectItem value='false'>Không hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='max-w-xs'>
        <Select
          value={searchParams.get('isSystemRole') || 'all'}
          onValueChange={(value) =>
            setSearchParams((prev) => {
              const params = new URLSearchParams(prev)
              params.set('page', '1')
              if (value === 'all') {
                params.delete('isSystemRole')
              } else {
                params.set('isSystemRole', value)
              }
              return params
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Loại vai trò' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Loại vai trò</SelectItem>
            <SelectItem value='true'>Vai trò hệ thống</SelectItem>
            <SelectItem value='false'>Vai trò tùy chỉnh</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='max-w-sm'>
        <ComboboxFacultyDepartment
          value={searchParams.get('scopeFacultyDepartmentId') || ''}
          onValueChange={(value: string) =>
            setSearchParams((prev) => {
              const params = new URLSearchParams(prev)
              params.set('page', '1')
              if (value) {
                params.set('scopeFacultyDepartmentId', value)
              } else {
                params.delete('scopeFacultyDepartmentId')
              }
              return params
            })
          }
          placeholder='Phạm vi khoa/phòng ban...'
          width='100%'
          className='min-w-72'
        />
      </div>

      <Button variant='outline' onClick={() => setSearchParams(null)} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}

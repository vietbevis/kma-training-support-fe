import ComboboxFacultyDepartment from '@/features/faculty-departments/components/ComboboxFacultyDepartment'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface RoleFiltersProps {
  filters: Record<string, string>
  setFilters: (filters: Record<string, string>) => void
  resetFilters: () => void
}

export const RoleFilters = ({ filters, setFilters, resetFilters }: RoleFiltersProps) => {
  const [search, setSearch] = useState(filters.search || '')

  const debouncedSearch = useDebounce(search)

  useEffect(() => {
    setFilters({ search: debouncedSearch })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  const handleResetFilters = () => {
    setSearch('')
    resetFilters()
  }

  return (
    <div className='flex items-center gap-4 flex-wrap'>
      <div className='flex-1 max-w-sm'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm kiếm theo tên vai trò...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      <div className='max-w-xs'>
        <Select
          value={filters.isActive || 'all'}
          onValueChange={(value: string) => setFilters({ isActive: value === 'all' ? '' : value })}
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
          value={filters.isSystemRole || 'all'}
          onValueChange={(value: string) => setFilters({ isSystemRole: value === 'all' ? '' : value })}
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
          value={filters.scopeFacultyDepartmentId || ''}
          onValueChange={(value: string) => setFilters({ scopeFacultyDepartmentId: value })}
          placeholder='Phạm vi khoa/phòng ban...'
          width='100%'
          className='min-w-72'
        />
      </div>

      <Button variant='outline' onClick={handleResetFilters} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}

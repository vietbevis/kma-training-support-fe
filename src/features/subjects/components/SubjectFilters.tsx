import ComboboxFacultyDepartment from '@/features/faculty-departments/components/ComboboxFacultyDepartment'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SubjectFiltersProps {
  filters: Record<string, string>
  setFilters: (filters: Record<string, string>) => void
  resetFilters: () => void
}

export const SubjectFilters = ({ filters, setFilters, resetFilters }: SubjectFiltersProps) => {
  const [search, setSearch] = useState(filters.search || '')

  const debouncedSearch = useDebounce(search)

  useEffect(() => {
    setFilters({ search: debouncedSearch, page: '1' })
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
            placeholder='Tìm kiếm theo tên và mã...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      <div className='max-w-sm'>
        <ComboboxFacultyDepartment
          value={filters.facultyDepartmentId || ''}
          onValueChange={(value: string) => setFilters({ facultyDepartmentId: value, page: '1' })}
          placeholder='Chọn khoa...'
          width='100%'
          className='min-w-72'
          isFaculty
        />
      </div>

      <Button variant='outline' onClick={handleResetFilters} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}

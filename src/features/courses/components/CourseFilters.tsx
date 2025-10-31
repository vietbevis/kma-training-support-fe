import ComboboxFacultyDepartment from '@/features/faculty-departments/components/ComboboxFacultyDepartment'
import ComboboxSubjects from '@/features/subjects/components/ComboboxSubjects'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { KyHoc } from '@/shared/lib/enum'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CourseFiltersProps {
  filters: Record<string, string>
  setFilters: (filters: Record<string, string>) => void
  resetFilters: () => void
}

export const CourseFilters = ({ filters, setFilters, resetFilters }: CourseFiltersProps) => {
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
      <div className='flex-1 max-w-md'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm kiếm theo mã/tên học phần...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      <div className='max-w-sm w-full'>
        <ComboboxFacultyDepartment
          value={filters.facultyDepartmentId || ''}
          onValueChange={(value: string) => setFilters({ facultyDepartmentId: value, page: '1' })}
          isFaculty
        />
      </div>

      <div className='max-w-sm w-full'>
        <ComboboxSubjects
          value={filters.subjectId || ''}
          facultyDepartmentId={filters.facultyDepartmentId || ''}
          onValueChange={(value: string) => setFilters({ subjectId: value, page: '1' })}
        />
      </div>

      <Select
        value={filters.semester || ''}
        onValueChange={(value: string) => setFilters({ semester: value === 'all' ? '' : value, page: '1' })}
      >
        <SelectTrigger className='w-40'>
          <SelectValue placeholder='Kỳ học' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Kỳ học</SelectItem>
          {Object.values(KyHoc).map((k) => (
            <SelectItem key={k} value={k}>
              {k}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant='outline' onClick={handleResetFilters} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}

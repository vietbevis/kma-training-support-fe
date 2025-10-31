import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { EducationLevels, Tuitions } from '@/shared/validations/EducationalSystemSchema'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface EducationalSystemFiltersProps {
  filters: Record<string, string>
  setFilters: (filters: Record<string, string>) => void
  resetFilters: () => void
}

export const EducationalSystemFilters = ({ filters, setFilters, resetFilters }: EducationalSystemFiltersProps) => {
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
            placeholder='Tìm kiếm theo mã, tên lớp...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      <Select
        value={filters.educationLevels || 'all'}
        onValueChange={(value: string) => setFilters({ educationLevels: value === 'all' ? '' : value, page: '1' })}
      >
        <SelectTrigger className='w-40'>
          <SelectValue placeholder='Bậc đào tạo' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Bậc đào tạo</SelectItem>
          {EducationLevels.options.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.tuitions || 'all'}
        onValueChange={(value: string) => setFilters({ tuitions: value === 'all' ? '' : value, page: '1' })}
      >
        <SelectTrigger className='w-40'>
          <SelectValue placeholder='Học phí' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Học phí</SelectItem>
          {Tuitions.options.map((tuition) => (
            <SelectItem key={tuition} value={tuition}>
              {tuition}
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

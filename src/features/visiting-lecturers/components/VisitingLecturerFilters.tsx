import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface VisitingLecturerFiltersProps {
  filters: Record<string, string>
  setFilters: (filters: Record<string, string>) => void
  resetFilters: () => void
  page: 'active' | 'academy-approved' | 'pending' | 'inactive'
}

export const VisitingLecturerFilters = ({ filters, setFilters, resetFilters, page }: VisitingLecturerFiltersProps) => {
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
            placeholder='Tìm kiếm theo họ tên...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {page === 'pending' ? (
        <>
          <Select
            value={filters.trainingApproved || 'all'}
            onValueChange={(value: string) => setFilters({ trainingApproved: value === 'all' ? '' : value, page: '1' })}
          >
            <SelectTrigger className='max-w-sm'>
              <SelectValue placeholder='Đào tạo duyệt' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Đào tạo duyệt</SelectItem>
              <SelectItem value='true'>Đã duyệt</SelectItem>
              <SelectItem value='false'>Chưa duyệt</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.facultyApproved || 'all'}
            onValueChange={(value: string) => setFilters({ facultyApproved: value === 'all' ? '' : value, page: '1' })}
          >
            <SelectTrigger className='max-w-sm'>
              <SelectValue placeholder='Khoa duyệt' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Khoa duyệt</SelectItem>
              <SelectItem value='true'>Đã duyệt</SelectItem>
              <SelectItem value='false'>Chưa duyệt</SelectItem>
            </SelectContent>
          </Select>
        </>
      ) : null}

      <Button variant='outline' onClick={handleResetFilters} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}

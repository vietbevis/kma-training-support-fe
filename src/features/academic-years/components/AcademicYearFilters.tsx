import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AcademicYearFiltersProps {
  filters: Record<string, string>
  setFilters: (filters: Record<string, string>) => void
  resetFilters: () => void
}

export const AcademicYearFilters = ({ filters, setFilters, resetFilters }: AcademicYearFiltersProps) => {
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
            placeholder='Tìm kiếm theo mã năm học...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
            className='pl-10'
          />
        </div>
      </div>

      <Button variant='outline' onClick={handleResetFilters} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}

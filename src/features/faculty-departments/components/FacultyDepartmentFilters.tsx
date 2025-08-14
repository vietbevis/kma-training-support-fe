import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Search, X } from 'lucide-react'
import { useState } from 'react'

interface FacultyDepartmentFiltersProps {
  filters: Record<string, string>
  setFilters: (filters: Record<string, string>) => void
  resetFilters: () => void
}

export const FacultyDepartmentFilters = ({ filters, setFilters, resetFilters }: FacultyDepartmentFiltersProps) => {
  const [search, setSearch] = useState(filters.search || '')

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

      <Select
        value={filters.isFaculty || 'all'}
        onValueChange={(value: string) => setFilters({ isFaculty: value === 'all' ? '' : value })}
      >
        <SelectTrigger className='w-40 max-w-sm'>
          <SelectValue placeholder='Loại đơn vị' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Khoa/Phòng ban</SelectItem>
          <SelectItem value='true'>Khoa</SelectItem>
          <SelectItem value='false'>Phòng ban</SelectItem>
        </SelectContent>
      </Select>

      <Button variant='outline' onClick={handleResetFilters} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface UserFiltersProps {
  filters: Record<string, string>
  setFilters: (filters: Record<string, string>) => void
  resetFilters: () => void
}

export const UserFilters = ({ filters, setFilters, resetFilters }: UserFiltersProps) => {
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
            placeholder='Tìm kiếm theo họ tên...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>
      <Select
        value={filters.areTeaching || 'all'}
        onValueChange={(value: string) => setFilters({ areTeaching: value === 'all' ? '' : value })}
      >
        <SelectTrigger className='max-w-sm'>
          <SelectValue placeholder='Trạng thái giảng dạy' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Trạng thái giảng dạy</SelectItem>
          <SelectItem value='true'>Đang giảng dạy</SelectItem>
          <SelectItem value='false'>Ngừng giảng dạy</SelectItem>
        </SelectContent>
      </Select>

      <Button variant='outline' onClick={handleResetFilters} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}

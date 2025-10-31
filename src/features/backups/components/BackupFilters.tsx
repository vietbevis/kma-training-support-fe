import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { BackupStatus, BackupType } from '@/shared/lib/enum'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface BackupFiltersProps {
  filters: Record<string, string>
  setFilters: (filters: Record<string, string>) => void
  resetFilters: () => void
}

export const BackupFilters = ({ filters, setFilters, resetFilters }: BackupFiltersProps) => {
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
    <div className='flex flex-col md:flex-row gap-4'>
      <div className='relative w-80'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Tìm kiếm theo tên backup...'
          className='pl-8'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className='w-40'>
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ status: value === 'all' ? '' : value, page: '1' })}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả</SelectItem>
            <SelectItem value={BackupStatus.PENDING}>Đang chờ</SelectItem>
            <SelectItem value={BackupStatus.IN_PROGRESS}>Đang xử lý</SelectItem>
            <SelectItem value={BackupStatus.COMPLETED}>Hoàn thành</SelectItem>
            <SelectItem value={BackupStatus.FAILED}>Thất bại</SelectItem>
            <SelectItem value={BackupStatus.RESTORED}>Đã khôi phục</SelectItem>
            <SelectItem value={BackupStatus.CANCELLED}>Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='w-40'>
        <Select
          value={filters.type}
          onValueChange={(value) => setFilters({ type: value === 'all' ? '' : value, page: '1' })}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Loại' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả</SelectItem>
            <SelectItem value={BackupType.MANUAL}>Thủ công</SelectItem>
            <SelectItem value={BackupType.SCHEDULED}>Tự động</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant='outline' onClick={handleResetFilters} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useDebounceSearchParams } from '@/shared/hooks/useDebounceSearchParams'
import { Search, X } from 'lucide-react'

export const FacultyDepartmentFilters = () => {
  const [searchParams, setSearchParams] = useDebounceSearchParams()

  return (
    <div className='flex items-center gap-4 flex-wrap'>
      <div className='flex-1 max-w-sm'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm kiếm theo tên và mã...'
            value={searchParams.get('search') || ''}
            onChange={(e) => setSearchParams({ search: e.target.value, page: '1' })}
            className='pl-10'
          />
        </div>
      </div>

      <Select
        value={searchParams.get('isFaculty') || 'all'}
        onValueChange={(value) =>
          setSearchParams({ isFaculty: value === 'all' ? '' : value === 'true' ? 'true' : 'false', page: '1' })
        }
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

      <Button variant='outline' onClick={() => setSearchParams(null)} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}

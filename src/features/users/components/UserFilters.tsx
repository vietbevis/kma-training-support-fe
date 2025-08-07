import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useDebounceSearchParams } from '@/shared/hooks/useDebounceSearchParams'
import { Search, X } from 'lucide-react'

export const UserFilters = () => {
  const [searchParams, setSearchParams] = useDebounceSearchParams()

  return (
    <div className='flex items-center gap-4 flex-wrap'>
      <div className='flex-1 min-w-[200px]'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm kiếm theo họ tên...'
            value={searchParams.get('search') || ''}
            onChange={(e) => setSearchParams({ search: e.target.value })}
            className='pl-10'
          />
        </div>
      </div>
      <Select
        value={
          searchParams.get('areTeaching') ? (searchParams.get('areTeaching') === 'true' ? 'true' : 'false') : 'all'
        }
        onValueChange={(value) =>
          setSearchParams({ areTeaching: value === 'all' ? '' : value === 'true' ? 'true' : 'false' })
        }
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Trạng thái giảng dạy' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Trạng thái giảng dạy</SelectItem>
          <SelectItem value='true'>Đang giảng dạy</SelectItem>
          <SelectItem value='false'>Ngừng giảng dạy</SelectItem>
        </SelectContent>
      </Select>

      <Button variant='outline' onClick={() => setSearchParams(null)} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}

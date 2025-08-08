import ComboboxBuilding from '@/features/buildings/components/ComboboxBuilding'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useDebounceSearchParams } from '@/shared/hooks/useDebounceSearchParams'
import { Search, X } from 'lucide-react'

export const ClassroomFilters = () => {
  const [searchParams, setSearchParams] = useDebounceSearchParams()

  return (
    <div className='flex items-center gap-4 flex-wrap'>
      <div className='flex-1 max-w-md'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm kiếm theo tên phòng học...'
            value={searchParams.get('search') || ''}
            onChange={(e) => setSearchParams({ search: e.target.value, page: '1' })}
            className='pl-10'
          />
        </div>
      </div>

      <div className='max-w-md min-w-sm'>
        <ComboboxBuilding
          value={searchParams.get('buildingId') || ''}
          onValueChange={(value: string) => setSearchParams({ buildingId: value, page: '1' })}
        />
      </div>

      <Button variant='outline' onClick={() => setSearchParams(null)} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}

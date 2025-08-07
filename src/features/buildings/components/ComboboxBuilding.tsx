import ForwardedInfiniteCombobox, { type UseInfiniteQueryResult } from '@/shared/components/ForwardedInfiniteCombobox'
import { Badge } from '@/shared/components/ui/badge'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/lib/utils'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { useGetBuildingsInfiniteQuery } from '../api/BuildingService'

interface BuildingComboboxItem {
  id: string
  name: string
}

interface ComboboxBuildingProps {
  value?: string
  onValueChange?: (value: string) => void
}

const ComboboxBuilding = ({ value, onValueChange }: ComboboxBuildingProps) => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 300)

  const queryResult = useGetBuildingsInfiniteQuery({
    search: debouncedSearchValue || undefined
  })

  const buildings: UseInfiniteQueryResult<BuildingComboboxItem> = {
    ...queryResult,
    data: queryResult.data
      ? {
          ...queryResult.data,
          pages: queryResult.data.pages.map((page) => ({
            ...page,
            data: page.data.map((building) => ({
              id: building.id,
              name: building.name
            }))
          }))
        }
      : undefined
  }

  return (
    <ForwardedInfiniteCombobox
      queryResult={buildings}
      value={value}
      onValueChange={onValueChange}
      multiple={false}
      placeholder='Chọn tòa nhà...'
      searchPlaceholder='Tìm kiếm tòa nhà...'
      emptyText='Không tìm thấy tòa nhà'
      onSearchValueChange={setSearchValue}
      itemRenderer={(building, isSelected, isMaxReached) => (
        <>
          <Check className={cn('mr-2 h-4 w-4 flex-shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
          <div className='flex-1 min-w-0'>
            <div className='truncate font-medium'>{building.name}</div>
          </div>
          {isMaxReached && <span className='text-xs text-muted-foreground ml-2 flex-shrink-0'>Đã đạt giới hạn</span>}
        </>
      )}
      // Custom badge renderer
      selectedBadgeRenderer={(building) => (
        <Badge key={building.id} variant='outline' className='truncate text-xs max-w-[120px] h-6'>
          <span className='truncate'>{building.name}</span>
        </Badge>
      )}
    />
  )
}

export default ComboboxBuilding

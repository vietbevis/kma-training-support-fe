import type { UseInfiniteQueryResult } from '@/shared/components/ForwardedInfiniteCombobox'
import ForwardedInfiniteCombobox from '@/shared/components/ForwardedInfiniteCombobox'
import { Badge } from '@/shared/components/ui/badge'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/lib/utils'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { useEducationalSystemsOptionsInfiniteQuery } from '../api/EducationalSystemService'

interface EducationalSystemComboboxItem {
  id: string
  name: string
}

interface ComboboxEducationalSystemProps {
  value?: string
  onValueChange?: (value: string) => void
}

const ComboboxEducationalSystem = ({ value, onValueChange }: ComboboxEducationalSystemProps) => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 300)

  const queryResult = useEducationalSystemsOptionsInfiniteQuery({
    search: debouncedSearchValue || undefined
  })

  const items: UseInfiniteQueryResult<EducationalSystemComboboxItem> = {
    ...queryResult,
    data: queryResult.data
      ? {
          ...queryResult.data,
          pages: queryResult.data.pages.map((page) => ({
            ...page,
            data: page.data.map((system) => ({
              id: `${system.educationLevels} (${system.tuitions})`,
              name: `${system.educationLevels} (${system.tuitions})`
            }))
          }))
        }
      : undefined
  }

  return (
    <ForwardedInfiniteCombobox
      queryResult={items}
      value={value}
      onValueChange={onValueChange}
      multiple={false}
      placeholder='Chọn hệ đào tạo...'
      searchPlaceholder='Tìm kiếm hệ đào tạo...'
      emptyText='Không tìm thấy hệ đào tạo'
      onSearchValueChange={setSearchValue}
      itemRenderer={(item, isSelected, isMaxReached) => (
        <>
          <Check className={cn('mr-2 h-4 w-4 flex-shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
          <div className='flex-1 min-w-0'>
            <div className='truncate font-medium'>{item.name}</div>
          </div>
          {isMaxReached && <span className='text-xs text-muted-foreground ml-2 flex-shrink-0'>Đã đạt giới hạn</span>}
        </>
      )}
      selectedBadgeRenderer={(item) => (
        <Badge key={item.id} variant='outline' className='truncate text-xs max-w-[160px] h-6'>
          <span className='truncate'>{item.name}</span>
        </Badge>
      )}
    />
  )
}

export default ComboboxEducationalSystem

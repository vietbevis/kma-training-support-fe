import type { UseInfiniteQueryResult } from '@/shared/components/ForwardedInfiniteCombobox'
import ForwardedInfiniteCombobox from '@/shared/components/ForwardedInfiniteCombobox'
import { Badge } from '@/shared/components/ui/badge'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/lib/utils'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { useExemptionPercentagesInfiniteQuery } from '../api/ExemptionPercentageService'

interface ExemptionPercentageComboboxItem {
  id: string
  name: string
  reason: string
  percentage: number
}

interface ComboboxExemptionPercentageProps {
  value?: string
  onValueChange?: (value: string) => void
}

const ComboboxExemptionPercentage = ({ value, onValueChange }: ComboboxExemptionPercentageProps) => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 300)

  const queryResult = useExemptionPercentagesInfiniteQuery({
    search: debouncedSearchValue || undefined
  })

  const exemptionPercentages: UseInfiniteQueryResult<ExemptionPercentageComboboxItem> = {
    ...queryResult,
    data: queryResult.data
      ? {
          ...queryResult.data,
          pages: queryResult.data.pages.map((page) => ({
            ...page,
            data: page.data.map((exemptionPercentage) => ({
              id: exemptionPercentage.id,
              name: exemptionPercentage.reason,
              reason: exemptionPercentage.reason,
              percentage: exemptionPercentage.percentage
            }))
          }))
        }
      : undefined
  }

  return (
    <ForwardedInfiniteCombobox
      queryResult={exemptionPercentages}
      value={value}
      onValueChange={onValueChange}
      multiple={false}
      placeholder='Chọn phần trăm miễn giảm...'
      searchPlaceholder='Tìm kiếm phần trăm miễn giảm...'
      emptyText='Không tìm thấy phần trăm miễn giảm'
      onSearchValueChange={setSearchValue}
      textDisplay={(exemptionPercentage) => `${exemptionPercentage.reason} (${exemptionPercentage.percentage}%)`}
      itemRenderer={(exemptionPercentage, isSelected, isMaxReached) => (
        <>
          <Check className={cn('mr-2 h-4 w-4 flex-shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
          <div className='flex-1 min-w-0'>
            <span className='truncate font-medium'>
              {exemptionPercentage.reason} ({exemptionPercentage.percentage}%)
            </span>
          </div>
          {isMaxReached && <span className='text-xs text-muted-foreground ml-2 flex-shrink-0'>Đã đạt giới hạn</span>}
        </>
      )}
      selectedBadgeRenderer={(exemptionPercentage) => (
        <Badge key={exemptionPercentage.id} variant='outline' className='truncate text-xs max-w-[120px] h-6'>
          <span className='truncate'>
            {exemptionPercentage.reason} ({exemptionPercentage.percentage}%)
          </span>
        </Badge>
      )}
    />
  )
}

export default ComboboxExemptionPercentage

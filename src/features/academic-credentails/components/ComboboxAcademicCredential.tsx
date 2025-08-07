import type { UseInfiniteQueryResult } from '@/shared/components/ForwardedInfiniteCombobox'
import ForwardedInfiniteCombobox from '@/shared/components/ForwardedInfiniteCombobox'
import { Badge } from '@/shared/components/ui/badge'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/lib/utils'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { useAcademicCredentialsInfiniteQuery } from '../api/AcademicCredentialService'

interface AcademicCredentialComboboxItem {
  id: string
  name: string
}

interface ComboboxAcademicCredentialProps {
  value?: string
  onValueChange?: (value: string) => void
}

const ComboboxAcademicCredential = ({ value, onValueChange }: ComboboxAcademicCredentialProps) => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 300)

  const queryResult = useAcademicCredentialsInfiniteQuery({
    search: debouncedSearchValue || undefined
  })

  const academicCredentials: UseInfiniteQueryResult<AcademicCredentialComboboxItem> = {
    ...queryResult,
    data: queryResult.data
      ? {
          ...queryResult.data,
          pages: queryResult.data.pages.map((page) => ({
            ...page,
            data: page.data.map((academicCredential) => ({
              id: academicCredential.id,
              name: academicCredential.name
            }))
          }))
        }
      : undefined
  }

  return (
    <ForwardedInfiniteCombobox
      queryResult={academicCredentials}
      value={value}
      onValueChange={onValueChange}
      multiple={false}
      placeholder='Chọn học hàm/học vị...'
      searchPlaceholder='Tìm kiếm học hàm/học vị...'
      emptyText='Không tìm thấy học hàm/học vị'
      onSearchValueChange={setSearchValue}
      itemRenderer={(academicCredential, isSelected, isMaxReached) => (
        <>
          <Check className={cn('mr-2 h-4 w-4 flex-shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
          <div className='flex-1 min-w-0'>
            <div className='truncate font-medium'>{academicCredential.name}</div>
          </div>
          {isMaxReached && <span className='text-xs text-muted-foreground ml-2 flex-shrink-0'>Đã đạt giới hạn</span>}
        </>
      )}
      // Custom badge renderer
      selectedBadgeRenderer={(academicCredential) => (
        <Badge key={academicCredential.id} variant='outline' className='truncate text-xs max-w-[120px] h-6'>
          <span className='truncate'>{academicCredential.name}</span>
        </Badge>
      )}
    />
  )
}

export default ComboboxAcademicCredential

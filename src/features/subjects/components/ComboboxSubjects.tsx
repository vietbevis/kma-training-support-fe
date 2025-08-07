import ForwardedInfiniteCombobox, { type UseInfiniteQueryResult } from '@/shared/components/ForwardedInfiniteCombobox'
import { Badge } from '@/shared/components/ui/badge'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/lib/utils'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { useInfiniteSubjectQuery } from '../api/SubjectService'

interface SubjectComboboxItem {
  id: string
  name: string
}

interface ComboboxDepartmentProps {
  value?: string
  onValueChange?: (value: string) => void
  facultyDepartmentId?: string
  disabled?: boolean
}

const ComboboxSubjects = ({ value, onValueChange, facultyDepartmentId, disabled }: ComboboxDepartmentProps) => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearch = useDebounce(searchValue, 300)

  const queryResult = useInfiniteSubjectQuery({
    search: debouncedSearch || undefined,
    facultyDepartmentId: facultyDepartmentId || undefined
  })

  const subjects: UseInfiniteQueryResult<SubjectComboboxItem> = {
    ...queryResult,
    data: queryResult.data
      ? {
          ...queryResult.data,
          pages: queryResult.data.pages.map((page) => ({
            ...page,
            data: page.data.map((subject) => ({
              id: subject.id,
              name: subject.name
            }))
          }))
        }
      : undefined
  }

  return (
    <ForwardedInfiniteCombobox
      queryResult={subjects}
      value={value}
      onValueChange={onValueChange}
      multiple={false}
      placeholder='Chọn bộ môn...'
      searchPlaceholder='Tìm kiếm bộ môn...'
      emptyText='Không tìm thấy bộ môn'
      onSearchValueChange={setSearchValue}
      disabled={disabled}
      itemRenderer={(subject, isSelected, isMaxReached) => (
        <>
          <Check className={cn('mr-2 h-4 w-4 flex-shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
          <div className='flex-1 min-w-0'>
            <div className='truncate font-medium'>{subject.name}</div>
          </div>
          {isMaxReached && <span className='text-xs text-muted-foreground ml-2 flex-shrink-0'>Đã đạt giới hạn</span>}
        </>
      )}
      // Custom badge renderer
      selectedBadgeRenderer={(subject) => (
        <Badge key={subject.id} variant='outline' className='truncate text-xs max-w-[120px] h-6'>
          <span className='truncate'>{subject.name}</span>
        </Badge>
      )}
    />
  )
}

export default ComboboxSubjects

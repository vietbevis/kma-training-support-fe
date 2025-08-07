import type { UseInfiniteQueryResult } from '@/shared/components/ForwardedInfiniteCombobox'
import ForwardedInfiniteCombobox from '@/shared/components/ForwardedInfiniteCombobox'
import { Badge } from '@/shared/components/ui/badge'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/lib/utils'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { useInfiniteFacultyDepartmentQuery } from '../api/FacultyDepartmentService'

interface FacultyDepartmentComboboxItem {
  id: string
  name: string
}

interface ComboboxFacultyDepartmentProps {
  // Single select props
  value?: string
  onValueChange?: (value: string) => void

  // Multi select props
  values?: string[]
  onValuesChange?: (values: string[]) => void

  // Common props
  placeholder?: string
  disabled?: boolean
  className?: string
  width?: string
  multiple?: boolean
  maxSelection?: number
  showSelectionCount?: boolean
  isFaculty?: boolean
  error?: string
  searchPlaceholder?: string
  emptyText?: string
}

const ComboboxFacultyDepartment = ({
  value,
  onValueChange,
  values = [],
  onValuesChange,
  placeholder = 'Chọn khoa/phòng ban...',
  disabled = false,
  className,
  width = '100%',
  multiple = false,
  maxSelection,
  showSelectionCount = false,
  isFaculty = false,
  error,
  searchPlaceholder = 'Tìm kiếm khoa/phòng ban...',
  emptyText = 'Không tìm thấy khoa/phòng ban'
}: ComboboxFacultyDepartmentProps) => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 300)

  const queryResult = useInfiniteFacultyDepartmentQuery({
    search: debouncedSearchValue || undefined,
    isFaculty: isFaculty ? 'true' : undefined
  })

  const facultyDepartments: UseInfiniteQueryResult<FacultyDepartmentComboboxItem> = {
    ...queryResult,
    data: queryResult.data
      ? {
          ...queryResult.data,
          pages: queryResult.data.pages.map((page) => ({
            ...page,
            data: page.data.map((facultyDepartment) => ({
              id: facultyDepartment.id,
              name: facultyDepartment.name
            }))
          }))
        }
      : undefined
  }

  return (
    <ForwardedInfiniteCombobox
      queryResult={facultyDepartments}
      value={value}
      onValueChange={onValueChange}
      values={values}
      onValuesChange={onValuesChange}
      multiple={multiple}
      maxSelection={maxSelection}
      showSelectionCount={showSelectionCount}
      width={width}
      className={className}
      error={error}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyText={emptyText}
      onSearchValueChange={setSearchValue}
      disabled={disabled}
      itemRenderer={(facultyDepartment, isSelected, isMaxReached) => (
        <>
          <Check className={cn('mr-2 h-4 w-4 flex-shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
          <div className='flex-1 min-w-0'>
            <div className='truncate font-medium'>{facultyDepartment.name}</div>
          </div>
          {isMaxReached && <span className='text-xs text-muted-foreground ml-2 flex-shrink-0'>Đã đạt giới hạn</span>}
        </>
      )}
      // Custom badge renderer
      selectedBadgeRenderer={(facultyDepartment) => (
        <Badge key={facultyDepartment.id} variant='outline' className='truncate text-xs max-w-[120px] h-6'>
          <span className='truncate'>{facultyDepartment.name}</span>
        </Badge>
      )}
    />
  )
}

export default ComboboxFacultyDepartment

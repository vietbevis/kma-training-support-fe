import { useInfiniteClassroomQuery } from '@/features/classrooms/api/ClassroomService'
import type { UseInfiniteQueryResult } from '@/shared/components/ForwardedInfiniteCombobox'
import ForwardedInfiniteCombobox from '@/shared/components/ForwardedInfiniteCombobox'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useState } from 'react'

interface ComboboxClassroomItem {
  id: string
  name: string
  capacity?: number
}

interface ComboboxClassroomProps {
  value: string
  onValueChange: (value: string) => void
  buildingName?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  width?: string
  error?: string
}

export const ComboboxClassroom = ({
  value,
  onValueChange,
  buildingName,
  placeholder = 'Chọn phòng học...',
  disabled,
  className,
  width,
  error
}: ComboboxClassroomProps) => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 300)

  const queryResult = useInfiniteClassroomQuery({
    search: debouncedSearchValue,
    buildingName
  })

  const classrooms: UseInfiniteQueryResult<ComboboxClassroomItem> = {
    ...queryResult,
    data: queryResult.data
      ? {
          ...queryResult.data,
          pages: queryResult.data.pages.map((page) => ({
            ...page,
            data: page.data.map((classroom) => ({
              id: classroom.id,
              name: classroom.name
            }))
          }))
        }
      : undefined
  }

  return (
    <ForwardedInfiniteCombobox
      queryResult={classrooms}
      value={value}
      onValueChange={onValueChange}
      width={width}
      className={className}
      error={error}
      placeholder={placeholder}
      onSearchValueChange={setSearchValue}
      disabled={disabled}
      itemRenderer={(item) => (
        <>
          <div className='flex-1'>
            <span className='font-medium'>{item.name}</span>
            {item.capacity && <span className='text-xs text-muted-foreground ml-2'>(SL: {item.capacity})</span>}
          </div>
        </>
      )}
    />
  )
}

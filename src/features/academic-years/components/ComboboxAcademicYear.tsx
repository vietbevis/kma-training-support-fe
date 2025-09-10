import { useInfiniteAcademicYearQuery } from '@/features/academic-years/api/AcademicYearService'
import type { UseInfiniteQueryResult } from '@/shared/components/ForwardedInfiniteCombobox'
import ForwardedInfiniteCombobox from '@/shared/components/ForwardedInfiniteCombobox'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useState } from 'react'

interface ComboboxAcademicYearItem {
  id: string
  name: string
}

interface ComboboxAcademicYearProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  width?: string
  error?: string
}

export const ComboboxAcademicYear = ({
  value,
  onValueChange,
  placeholder = 'Chọn năm học...',
  disabled,
  className,
  width,
  error
}: ComboboxAcademicYearProps) => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 300)

  const queryResult = useInfiniteAcademicYearQuery({
    search: debouncedSearchValue,
    limit: 20
  })

  const academicYears: UseInfiniteQueryResult<ComboboxAcademicYearItem> = {
    ...queryResult,
    data: queryResult.data
      ? {
          ...queryResult.data,
          pages: queryResult.data.pages.map((page) => ({
            ...page,
            data: page.data.map((academicYear) => ({
              id: academicYear.id,
              name: academicYear.yearCode
            }))
          }))
        }
      : undefined
  }

  return (
    <ForwardedInfiniteCombobox
      queryResult={academicYears}
      value={value}
      onValueChange={onValueChange}
      width={width}
      className={className}
      error={error}
      placeholder={placeholder}
      onSearchValueChange={setSearchValue}
      disabled={disabled}
    />
  )
}

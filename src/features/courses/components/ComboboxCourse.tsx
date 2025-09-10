import { useInfiniteCourseQuery } from '@/features/courses/api/CourseService'
import type { UseInfiniteQueryResult } from '@/shared/components/ForwardedInfiniteCombobox'
import ForwardedInfiniteCombobox from '@/shared/components/ForwardedInfiniteCombobox'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useState } from 'react'

interface ComboboxCourseItem {
  id: string
  name: string
}

interface ComboboxCourseProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  width?: string
  error?: string
}

export const ComboboxCourse = ({
  value,
  onValueChange,
  placeholder = 'Chọn học phần...',
  disabled,
  className,
  width,
  error
}: ComboboxCourseProps) => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 300)

  const queryResult = useInfiniteCourseQuery({
    search: debouncedSearchValue,
    limit: 20
  })

  const courses: UseInfiniteQueryResult<ComboboxCourseItem> = {
    ...queryResult,
    data: queryResult.data
      ? {
          ...queryResult.data,
          pages: queryResult.data.pages.map((page) => ({
            ...page,
            data: page.data.map((course) => ({
              id: course.id,
              name: `${course.courseCode} - ${course.courseName}`
            }))
          }))
        }
      : undefined
  }

  return (
    <ForwardedInfiniteCombobox
      queryResult={courses}
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

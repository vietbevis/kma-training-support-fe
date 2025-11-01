import { ComboboxAcademicYear } from '@/features/academic-years/components'
import { ComboboxCourse } from '@/features/courses/components'
import { Button } from '@/shared/components/ui/button'
import {
  DateField,
  DateFieldDays,
  DateFieldMonths,
  DateFieldSeparator,
  DateFieldYears
} from '@/shared/components/ui/date-field'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { KyHoc } from '@/shared/lib/enum'
import { useEffect, useState } from 'react'

interface TimetableFiltersProps {
  filters: {
    page?: string
    limit?: string
    courseId?: string
    academicYearId?: string
    semester?: string
    startDate?: string
    endDate?: string
    className?: string
  }
  setFilters: (filters: Record<string, string>) => void
  resetFilters: () => void
}

export const TimetableFilters = ({ filters, setFilters, resetFilters }: TimetableFiltersProps) => {
  const [className, setClassName] = useState(filters.className || '')
  const [startDate, setStartDate] = useState(filters.startDate || '')
  const [endDate, setEndDate] = useState(filters.endDate || '')
  const debouncedClassName = useDebounce(className)
  const debouncedStartDate = useDebounce(startDate)
  const debouncedEndDate = useDebounce(endDate)

  const handleDateChange = (field: 'startDate' | 'endDate', value: Date | null) => {
    if (field === 'startDate') {
      setStartDate(value ? value.toISOString().split('T')[0] : '')
    } else {
      setEndDate(value ? value.toISOString().split('T')[0] : '')
    }
  }

  useEffect(() => {
    setFilters({
      className: debouncedClassName || '',
      startDate: debouncedStartDate || '',
      endDate: debouncedEndDate || '',
      page: '1'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedClassName, debouncedStartDate, debouncedEndDate])

  return (
    <div className='flex gap-4 flex-wrap'>
      <div className='space-y-2 w-60'>
        <Label htmlFor='className' className='text-sm font-medium'>
          Tên lớp học phần
        </Label>
        <Input
          id='className'
          placeholder='Tìm kiếm theo tên lớp'
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
      </div>

      <div className='space-y-2 w-80'>
        <Label className='text-sm font-medium'>Học phần</Label>
        <ComboboxCourse
          value={filters.courseId || ''}
          onValueChange={(value) => setFilters({ courseId: value, page: '1' })}
        />
      </div>

      <div className='space-y-2 w-60'>
        <Label className='text-sm font-medium'>Năm học</Label>
        <ComboboxAcademicYear
          value={filters.academicYearId || ''}
          onValueChange={(value) => setFilters({ academicYearId: value, page: '1' })}
        />
      </div>

      <div className='space-y-2 w-40'>
        <Label className='text-sm font-medium'>Kỳ học</Label>
        <Select
          value={filters.semester || 'all'}
          onValueChange={(value) =>
            value === 'all' ? setFilters({ semester: '', page: '1' }) : setFilters({ semester: value, page: '1' })
          }
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Chọn kỳ học' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả</SelectItem>
            {Object.entries(KyHoc).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label className='text-sm font-medium' htmlFor='startDate'>
          Ngày bắt đầu
        </Label>
        <DateField
          value={startDate ? new Date(startDate) : null}
          onValueChange={(value) => handleDateChange('startDate', value)}
        >
          <DateFieldDays placeholder='dd' />
          <DateFieldSeparator />
          <DateFieldMonths placeholder='mm' />
          <DateFieldSeparator />
          <DateFieldYears placeholder='yyyy' />
        </DateField>
      </div>

      <div className='space-y-2'>
        <Label className='text-sm font-medium' htmlFor='endDate'>
          Ngày kết thúc
        </Label>
        <DateField
          value={endDate ? new Date(endDate) : null}
          onValueChange={(value) => handleDateChange('endDate', value)}
        >
          <DateFieldDays placeholder='dd' />
          <DateFieldSeparator />
          <DateFieldMonths placeholder='mm' />
          <DateFieldSeparator />
          <DateFieldYears placeholder='yyyy' />
        </DateField>
      </div>

      <div className='flex items-end col-span-1 md:col-span-2 lg:col-span-3'>
        <Button
          variant='outline'
          onClick={() => {
            resetFilters()
            setClassName('')
            setStartDate('')
            setEndDate('')
          }}
          className='ml-auto'
        >
          Đặt lại bộ lọc
        </Button>
      </div>
    </div>
  )
}

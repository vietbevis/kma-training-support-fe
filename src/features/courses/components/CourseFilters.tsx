import ComboboxFacultyDepartment from '@/features/faculty-departments/components/ComboboxFacultyDepartment'
import ComboboxSubjects from '@/features/subjects/components/ComboboxSubjects'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useDebounceSearchParams } from '@/shared/hooks/useDebounceSearchParams'
import { KyHoc } from '@/shared/lib/enum'
import { Search, X } from 'lucide-react'

export const CourseFilters = () => {
  const [searchParams, setSearchParams] = useDebounceSearchParams()

  const facultyDepartmentId = searchParams.get('facultyDepartmentId') || ''
  const subjectId = searchParams.get('subjectId') || ''
  const semester = searchParams.get('semester') || 'all'

  return (
    <div className='flex items-center gap-4 flex-wrap'>
      <div className='flex-1 max-w-md'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm kiếm theo mã/tên học phần...'
            value={searchParams.get('search') || ''}
            onChange={(e) => setSearchParams({ search: e.target.value, page: '1' })}
            className='pl-10'
          />
        </div>
      </div>

      <div className='max-w-sm w-full'>
        <ComboboxFacultyDepartment
          value={facultyDepartmentId}
          onValueChange={(value) => setSearchParams({ facultyDepartmentId: value || '', subjectId: '', page: '1' })}
          isFaculty
        />
      </div>

      <div className='max-w-sm w-full'>
        <ComboboxSubjects
          value={subjectId}
          facultyDepartmentId={facultyDepartmentId}
          onValueChange={(value) => setSearchParams({ subjectId: value || '', page: '1' })}
        />
      </div>

      <Select
        value={semester}
        onValueChange={(value) => setSearchParams({ semester: value === 'all' ? '' : value, page: '1' })}
      >
        <SelectTrigger className='w-40'>
          <SelectValue placeholder='Kỳ học' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Kỳ học</SelectItem>
          {Object.values(KyHoc).map((k) => (
            <SelectItem key={k} value={k}>
              {k}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant='outline' onClick={() => setSearchParams(null)} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}

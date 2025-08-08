import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useDebounceSearchParams } from '@/shared/hooks/useDebounceSearchParams'
import { EducationLevels, Tuitions } from '@/shared/validations/EducationalSystemSchema'
import { Search, X } from 'lucide-react'

export const EducationalSystemFilters = () => {
  const [searchParams, setSearchParams] = useDebounceSearchParams()

  return (
    <div className='flex items-center gap-4 flex-wrap'>
      <div className='flex-1 max-w-md'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm kiếm theo mã, tên lớp...'
            value={searchParams.get('search') || ''}
            onChange={(e) => setSearchParams({ search: e.target.value, page: '1' })}
            className='pl-10'
          />
        </div>
      </div>

      <Select
        value={searchParams.get('educationLevels') || 'all'}
        onValueChange={(value) => setSearchParams({ educationLevels: value === 'all' ? '' : value, page: '1' })}
      >
        <SelectTrigger className='w-40'>
          <SelectValue placeholder='Bậc đào tạo' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Bậc đào tạo</SelectItem>
          {EducationLevels.options.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get('tuitions') || 'all'}
        onValueChange={(value) => setSearchParams({ tuitions: value === 'all' ? '' : value, page: '1' })}
      >
        <SelectTrigger className='w-40'>
          <SelectValue placeholder='Học phí' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Học phí</SelectItem>
          {Tuitions.options.map((tuition) => (
            <SelectItem key={tuition} value={tuition}>
              {tuition}
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

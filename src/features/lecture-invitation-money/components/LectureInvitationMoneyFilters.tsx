import { ComboboxAcademicCredential } from '@/features/academic-credentails'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface LectureInvitationMoneyFiltersProps {
  filters: Record<string, string>
  setFilters: (filters: Record<string, string>) => void
  resetFilters: () => void
}

export const LectureInvitationMoneyFilters = ({
  filters,
  setFilters,
  resetFilters
}: LectureInvitationMoneyFiltersProps) => {
  const [search, setSearch] = useState(filters.search || '')

  const debouncedSearch = useDebounce(search)

  useEffect(() => {
    setFilters({ search: debouncedSearch, page: '1' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  const handleResetFilters = () => {
    setSearch('')
    resetFilters()
  }

  return (
    <div className='flex items-center gap-4 flex-wrap'>
      <div className='flex-1 max-w-md'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm kiếm theo hệ đào tạo, số tiền...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      <div className='max-w-sm w-full'>
        <ComboboxAcademicCredential
          value={filters.academicCredentialId || ''}
          onValueChange={(value: string) => setFilters({ academicCredentialId: value, page: '1' })}
        />
      </div>

      <Button variant='outline' onClick={handleResetFilters} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}

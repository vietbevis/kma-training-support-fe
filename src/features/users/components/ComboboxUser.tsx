import { useInfiniteUserQuery } from '@/features/users/api/UserService'
import type { UseInfiniteQueryResult } from '@/shared/components/ForwardedInfiniteCombobox'
import ForwardedInfiniteCombobox from '@/shared/components/ForwardedInfiniteCombobox'
import { Badge } from '@/shared/components/ui/badge'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/lib/utils'
import type { User } from '@/shared/validations/UserSchema'
import { Check } from 'lucide-react'
import { useState } from 'react'

export interface ComboboxUserItem {
  id: string
  name: string
  facultyDepartmentName?: string
}

interface ComboboxUserProps {
  value?: string
  onValueChange?: (value: string) => void
  onSelect?: (value: User | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  width?: string
  error?: string
  haveAccount?: boolean
}

const ComboboxUser = ({
  value,
  onValueChange,
  placeholder = 'Chọn nhân viên...',
  disabled,
  className,
  width = '100%',
  error,
  haveAccount
}: ComboboxUserProps) => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 300)

  const queryResult = useInfiniteUserQuery({
    search: debouncedSearchValue,
    ...(haveAccount !== undefined && { haveAccount: haveAccount ? 'true' : 'false' })
  })

  const users: UseInfiniteQueryResult<ComboboxUserItem> = {
    ...queryResult,
    data: queryResult.data
      ? {
          ...queryResult.data,
          pages: queryResult.data.pages.map((page) => ({
            ...page,
            data: page.data.map((user) => ({
              id: user.id,
              name: `${user.code} - ${user.fullName}`,
              facultyDepartmentName: user.facultyDepartment?.name
            }))
          }))
        }
      : undefined
  }

  return (
    <ForwardedInfiniteCombobox
      queryResult={users}
      value={value}
      onValueChange={onValueChange}
      width={width}
      className={className}
      error={error}
      placeholder={placeholder}
      onSearchValueChange={setSearchValue}
      disabled={disabled}
      itemRenderer={(user, isSelected, isMaxReached) => (
        <>
          <Check className={cn('mr-2 h-4 w-4 flex-shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
          <div className='flex-1 min-w-0'>
            <div className='truncate font-medium'>{user.name}</div>
            {user.facultyDepartmentName && (
              <span className='text-xs text-muted-foreground'>Khoa/Phòng ban: {user.facultyDepartmentName}</span>
            )}
          </div>
          {isMaxReached && <span className='text-xs text-muted-foreground ml-2 flex-shrink-0'>Đã đạt giới hạn</span>}
        </>
      )}
      // Custom badge renderer
      selectedBadgeRenderer={(user) => (
        <Badge key={user.id} variant='outline' className='truncate text-xs max-w-[120px] h-6'>
          <span className='truncate'>{user.name}</span>
        </Badge>
      )}
    />
  )
}

ComboboxUser.displayName = 'ComboboxUser'

export { ComboboxUser }
